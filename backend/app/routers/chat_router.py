from fastapi import APIRouter, HTTPException, status
import asyncio
from typing import Dict, Any, List

from app.models.api_models import ChatRequest, ChatResponse
from app.chat_state import get_session_data, update_session_data
from app.services import llm_service
from app.services.portfolio_service import generate_portfolio, run_monte_carlo_simulation
from app.models.portfolio_models import PortfolioRequest, MonteCarloRequest, MonteCarloResponse
from app.services.market_data_service import get_live_tickers

router = APIRouter()

REQUIRED_KEYS = ["capital", "monthly_investment", "risk_appetite", "preferred_tools"]

FOLLOW_UP_QUESTIONS = {
    "capital": "What's the total capital amount you'd like to allocate?",
    "monthly_investment": "How much can you invest monthly in your systematic plan?",
    "risk_appetite": "What's your preferred risk appetite profile? (low, medium, or high)",
    "preferred_tools": "Do you have specific preferred assets/brokers? (e.g. Zerodha, Direct Equity, Gold)",
}

@router.get("/api/market/tickers")
async def market_tickers_endpoint():
    """
    Returns streaming-style live ticker data and intraday sparklines.
    """
    return {"status": "success", "tickers": get_live_tickers()}

@router.post("/api/portfolio/simulate", response_model=MonteCarloResponse)
async def simulate_endpoint(req: MonteCarloRequest):
    """
    Executes stochastic Monte Carlo growth projection.
    """
    return run_monte_carlo_simulation(req)

@router.post("/api/portfolio/analytics")
async def direct_analytics_endpoint(req: PortfolioRequest):
    """
    Directly builds portfolio allocation and quantitative metrics without conversational session logic.
    """
    return generate_portfolio(req)

@router.post("/api/risk-quiz")
async def risk_quiz_endpoint(answers: Dict[str, int]):
    """
    Evaluates investor questionnaire score (scale 1-5 across 5 questions) to derive risk appetite.
    """
    total_score = sum(answers.values())
    if total_score <= 10:
        appetite = "low"
        description = "Capital Preservation Specialist: Focused on liquidity, low drawdown, and stable debt securities."
    elif total_score <= 18:
        appetite = "medium"
        description = "Balanced Growth Investor: Optimized balance between equity market upside and fixed income safety."
    else:
        appetite = "high"
        description = "Aggressive Alpha Investor: High equity and growth concentration aimed at long-term capital compounding."

    return {
        "score": total_score,
        "risk_appetite": appetite,
        "description": description
    }

@router.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    session_id = req.session_id
    message = req.message

    session = await get_session_data(session_id)
    classification = await llm_service.classify_intent_and_extract(message)
    intent = classification.get("intent", "general_question")
    entities = classification.get("entities", {}) or {}

    valid_updates = {k: v for k, v in entities.items() if v is not None}
    if valid_updates:
        await update_session_data(session_id, valid_updates)

    session = await get_session_data(session_id)

    if intent in ("portfolio_request", "providing_info"):
        missing = [
            k
            for k in REQUIRED_KEYS
            if k not in session or session.get(k) in (None, "")
        ]
        if missing:
            question = FOLLOW_UP_QUESTIONS.get(missing[0], "Can you provide more investment details?")
            return ChatResponse(response_type="text", content=question)

        try:
            preferred_tools = session.get("preferred_tools", [])
            if isinstance(preferred_tools, str):
                preferred_tools_list = [
                    t.strip() for t in preferred_tools.split(",") if t.strip()
                ]
            elif isinstance(preferred_tools, list):
                preferred_tools_list = preferred_tools
            else:
                preferred_tools_list = []

            portfolio_req = PortfolioRequest(
                capital=int(session.get("capital", 100000)),
                monthly_investment=int(session.get("monthly_investment", 5000)),
                risk_appetite=str(session.get("risk_appetite", "medium")),
                preferred_tools=preferred_tools_list,
            )
        except Exception as e:
            # Fallback request if parsing fails
            portfolio_req = PortfolioRequest(
                capital=100000,
                monthly_investment=5000,
                risk_appetite="medium",
                preferred_tools=["Equity Funds", "Debt"]
            )

        try:
            portfolio_result = await asyncio.to_thread(generate_portfolio, portfolio_req)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error generating portfolio: {e}",
            )

        if hasattr(portfolio_result, "model_dump"):
            portfolio_dict = portfolio_result.model_dump()
        elif hasattr(portfolio_result, "dict"):
            portfolio_dict = portfolio_result.dict()
        elif isinstance(portfolio_result, dict):
            portfolio_dict = portfolio_result
        else:
            portfolio_dict = {"result": str(portfolio_result)}

        formatted_text = await llm_service.present_portfolio(portfolio_dict)

        return ChatResponse(
            response_type="portfolio",
            content=formatted_text,
            portfolio_data=portfolio_dict,
        )

    else:
        answer = await llm_service.answer_general_question(message)
        return ChatResponse(response_type="text", content=answer)


    # This fallback is no longer reachable, which is good.