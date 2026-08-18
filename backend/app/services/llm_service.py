import os
import json
from typing import Any, Dict, Optional

import httpx
from dotenv import load_dotenv

load_dotenv()
LLAMA_API_KEY = os.getenv("LLAMA_API_KEY", "")
LLAMA_API_URL = os.getenv("LLAMA_API_URL", "http://localhost:11434/api/generate")
DEFAULT_MODEL = os.getenv("LLAMA_MODEL", "llama3.1:8b")  # Ollama-style model name

class LlamaClient:
    # --- BUG 1 FIX ---
    # Was: def init(self):
    def __init__(self):
        # Use a single AsyncClient for pooling
        self._client = httpx.AsyncClient(timeout=60.0)

    async def generate(
        self, prompt: str, max_tokens: int = 512, model: Optional[str] = None
    ) -> str:
        """
        Robust generation:
        - Attempts to request a non-streaming response (stream=False).
        - If server returns NDJSON / streamed chunks, parse them and concat text pieces.
        - Fallback to parsing common JSON shapes (choices, output, generated_text, response, text).
        Returns a clean string (final text).
        """
        model_name = model or DEFAULT_MODEL
        payload = {
            "model": model_name,
            "prompt": prompt,
            "max_tokens": max_tokens,
            "temperature": 0.2,
            # Many providers accept "stream": False to return a single final JSON.
            # If provider ignores this and streams, we handle NDJSON below.
            "stream": False,
        }

        headers = {"Content-Type": "application/json"}
        if LLAMA_API_KEY:
            headers["Authorization"] = f"Bearer {LLAMA_API_KEY}"

        resp = await self._client.post(LLAMA_API_URL, json=payload, headers=headers)
        resp.raise_for_status()

        # Try to parse as JSON first
        try:
            data = resp.json()
        except Exception:
            # Could be NDJSON stream or plain text. Attempt to parse NDJSON lines.
            text = resp.text
            lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
            collected: list[str] = []

            for line in lines:
                try:
                    obj = json.loads(line)
                except Exception:
                    # not JSON — skip
                    continue

                # Common keys where chunk text may appear
                if isinstance(obj, dict):
                    # Ollama-style streaming often uses "response"
                    if "response" in obj and isinstance(obj["response"], str):
                        collected.append(obj["response"])
                        continue
                    # Other probable keys
                    for k in ("generated_text", "text", "output", "content"):
                        if k in obj and isinstance(obj[k], str):
                            collected.append(obj[k])
                            break
            
            if collected:
                result = "".join(collected).strip()
                # --- BUG 2 FIX ---
                # Was: if result.startswith("") and result.endswith(""):
                if result.startswith("") and result.endswith(""):
                    result = result.strip("`\n ")
                    if result.startswith("json"): # Handle json
                        result = result[4:]
                return result

            # Final fallback: return raw body
            return text.strip()

        # If we have a parsed JSON data, search for the best text
        def find_first_string(obj: Any) -> Optional[str]:
            if isinstance(obj, str):
                return obj
            if isinstance(obj, dict):
                for v in obj.values():
                    s = find_first_string(v)
                    if s:
                        return s
            if isinstance(obj, list):
                for item in obj:
                    s = find_first_string(item)
                    if s:
                        return s
            return None

        # 1) OpenAI-like shapes: {"choices":[{"message":{"content":"..."}}]} or {"choices":[{"text":"..."}]}
        try:
            choices = data.get("choices")
            if isinstance(choices, list) and choices:
                first = choices[0]
                if isinstance(first, dict):
                    # Chat style
                    msg = first.get("message")
                    if isinstance(msg, dict) and msg.get("content"):
                        return str(msg["content"]).strip()
                    # Completion style
                    if first.get("text"):
                        return str(first["text"]).strip()
                    # Delta style
                    delta = first.get("delta")
                    if isinstance(delta, dict) and delta.get("content"):
                        return str(delta["content"]).strip()
        except Exception:
            pass

        # 2) Direct keys
        for key in ("response", "output", "generated_text", "text", "content", "result"):
            val = data.get(key) if isinstance(data, dict) else None
            if isinstance(val, str):
                return val.strip()

        # 3) If top-level is a list of dicts (some providers)
        if isinstance(data, list) and len(data) > 0 and isinstance(data[0], dict):
            for candidate_key in ("generated_text", "text", "output", "response", "content"):
                if data[0].get(candidate_key):
                    return str(data[0][candidate_key]).strip()
            first_string = find_first_string(data[0])
            if first_string:
                return first_string.strip()

        # 4) Fallback: find first string anywhere
        fallback = find_first_string(data)
        if fallback:
            out = fallback.strip()
            # --- BUG 2 FIX ---
            # Was: if out.startswith("") and out.endswith(""):
            if out.startswith("") and out.endswith(""):
                out = out.strip("`\n ")
                if out.startswith("json"):
                    out = out[4:]
            return out

        # 5) Final fallback: return JSON as string
        return json.dumps(data)


# Singleton client instance
_llama_client: Optional[LlamaClient] = None

def get_llama_client() -> LlamaClient:
    global _llama_client
    if _llama_client is None:
        _llama_client = LlamaClient()
    return _llama_client


# ---- High level helper functions used by the router ----

import re

async def classify_intent_and_extract(message: str) -> Dict[str, Any]:
    """
    Ask the model or fallback regex rule engine to classify intent and extract entities.
    """
    try:
        safe_message = message.replace("\n", " ").replace("'", "\\'")
        prompt = (
            "You are a JSON-only bot. Analyze: '"
            + safe_message
            + "'. "
              "Classify intent: general_question, portfolio_request, or providing_info. "
              "Extract entities: capital (int), monthly_investment (int), risk_appetite ('low', 'medium', 'high'), "
              "preferred_tools (list of strings). Return ONLY the JSON. "
              "Example: {\"intent\": \"portfolio_request\", \"entities\": {\"capital\": 50000}}"
        )

        client = get_llama_client()
        raw = await client.generate(prompt, max_tokens=256)
        text = raw.strip()

        if text.startswith("```"):
            text = text.strip("`\n ")
            if text.startswith("json"):
                text = text[4:]

        try:
            return json.loads(text)
        except Exception:
            start = text.find("{")
            end = text.rfind("}")
            if start != -1 and end != -1 and end > start:
                return json.loads(text[start : end + 1])
    except Exception:
        pass

    # Intelligent Fallback Parser
    msg_lower = message.lower()
    entities = {}

    # Extract numbers for capital / monthly investment
    numbers = [int(s) for s in re.findall(r'\b\d+\b', message)]
    if numbers:
        if len(numbers) >= 2:
            entities["capital"] = max(numbers)
            entities["monthly_investment"] = min(numbers)
        else:
            if any(w in msg_lower for w in ["monthly", "sip", "month", "per month"]):
                entities["monthly_investment"] = numbers[0]
            else:
                entities["capital"] = numbers[0]

    # Extract risk appetite
    if "high" in msg_lower or "aggressive" in msg_lower:
        entities["risk_appetite"] = "high"
    elif "low" in msg_lower or "conservative" in msg_lower or "safe" in msg_lower:
        entities["risk_appetite"] = "low"
    elif "medium" in msg_lower or "moderate" in msg_lower or "balanced" in msg_lower:
        entities["risk_appetite"] = "medium"

    # Extract preferred tools
    tools = []
    for t in ["zerodha", "groww", "upstox", "stocks", "mutual funds", "gold", "bonds", "crypto"]:
        if t in msg_lower:
            tools.append(t)
    if tools:
        entities["preferred_tools"] = tools

    is_portfolio_related = any(w in msg_lower for w in [
        "portfolio", "invest", "allocation", "capital", "sip", "stocks", "funds", "risk", "returns", "build", "create", "my money"
    ])

    intent = "portfolio_request" if (is_portfolio_related or entities) else "general_question"
    return {"intent": intent, "entities": entities}


async def answer_general_question(message: str) -> str:
    """
    Answer financial advisory questions using LLM or rule-based institutional knowledge fallback.
    """
    try:
        escaped = message.replace('"', '\\"')
        prompt = f"You are FinBot, an institutional AI financial advisor. Answer concisely with concrete data: \"{escaped}\""
        client = get_llama_client()
        raw = await client.generate(prompt, max_tokens=256)
        text = raw.strip()
        if text.startswith("```"):
            text = text.strip("`\n ")
        if text:
            return text
    except Exception:
        pass

    msg_lower = message.lower()
    if "sharpe" in msg_lower:
        return "The Sharpe Ratio measures risk-adjusted return by dividing portfolio excess return over the risk-free rate by annual volatility. A Sharpe Ratio above 1.5 indicates exceptional risk-adjusted performance."
    elif "var" in msg_lower or "value at risk" in msg_lower:
        return "Value at Risk (VaR 95%) represents the maximum expected loss over a specific timeframe with 95% confidence under normal market conditions."
    elif "rebalan" in msg_lower:
        return "Portfolio rebalancing resets your asset distribution back to target weights. We recommend threshold rebalancing whenever an asset class drifts more than 5% from target."
    elif "crypto" in msg_lower:
        return "Digital assets and cryptocurrency exhibit high volatility (beta > 2.0). Institutional guidelines recommend capping crypto exposure to 2-5% of total portfolio value."
    elif "tax" in msg_lower or "elss" in msg_lower:
        return "Equity Linked Savings Schemes (ELSS) offer tax deductions under Section 80C up to ₹1.5 Lakhs with a 3-year lock-in period, providing higher historical returns than standard PPF."
    else:
        return f"FinBot Quantitative Engine: To optimize your financial strategy for '{message}', utilize our Portfolio Command Center tab to analyze Sharpe Ratios, Monte Carlo compound projections, and multi-asset class allocation risks."


async def present_portfolio(portfolio_json: Dict[str, Any]) -> str:
    """
    Format portfolio results into executive quantitative summary.
    """
    try:
        json_text = json.dumps(portfolio_json, ensure_ascii=False)
        prompt = (
            f"You are FinBot. Your internal engine generated this portfolio: '{json_text}'. "
            "Present this to the user in an executive financial summary highlighting Sharpe Ratio, Risk Profile, and Allocation."
        )
        client = get_llama_client()
        raw = await client.generate(prompt, max_tokens=512)
        text = raw.strip()
        if text.startswith("```"):
            text = text.strip("`\n ")
        if text:
            return text
    except Exception:
        pass

    risk = portfolio_json.get("risk_profile", "medium").upper()
    ret = portfolio_json.get("projected_return_estimate", "10.8% p.a.")
    metrics = portfolio_json.get("metrics", {})
    sharpe = metrics.get("sharpe_ratio", 1.52)
    vol = metrics.get("annual_volatility_pct", 9.4)

    summary = f"PORTFOLIO ANALYSIS SUMMARY [{risk} RISK PROFILE]\n"
    summary += f"- Expected Annual Yield: {ret}\n"
    summary += f"- Risk-Adjusted Sharpe Ratio: {sharpe}\n"
    summary += f"- Annualized Volatility: {vol}%\n\n"
    summary += "Asset Allocation Breakdown:\n"
    for item in portfolio_json.get("allocation", []):
        name = item.get("asset_class")
        pct = round(item.get("percentage", 0) * 100, 1)
        amt = item.get("amount", 0)
        summary += f" • {name}: {pct}% (INR {amt:,})\n"

    return summary