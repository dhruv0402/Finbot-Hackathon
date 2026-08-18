from fastapi import APIRouter, HTTPException, status
import asyncio
from typing import Dict, Any, List

from app.models.api_models import ChatRequest, ChatResponse
from app.chat_state import get_session_data, update_session_data
from app.services import llm_service
from app.services.portfolio_service import generate_portfolio, run_monte_carlo_simulation
from app.models.portfolio_models import PortfolioRequest, MonteCarloRequest, MonteCarloResponse
from app.services.market_data_service import get_live_tickers

from app.services.mpt_service import compute_efficient_frontier
from app.services.stress_test_service import run_portfolio_stress_test
from app.services.pdf_report_service import generate_institutional_report_html

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
    return {"status": "success", "tickers": get_live_tickers()}

@router.post("/api/portfolio/simulate", response_model=MonteCarloResponse)
async def simulate_endpoint(req: MonteCarloRequest):
    return run_monte_carlo_simulation(req)

@router.post("/api/portfolio/analytics")
async def direct_analytics_endpoint(req: PortfolioRequest):
    return generate_portfolio(req)

@router.get("/api/portfolio/mpt-efficient-frontier")
async def mpt_efficient_frontier_endpoint():
    """
    Returns Markowitz Efficient Frontier optimization curve & tangency portfolio weights.
    """
    return compute_efficient_frontier()

@router.post("/api/portfolio/stress-test")
async def stress_test_endpoint(payload: Dict[str, Any]):
    """
    Evaluates portfolio performance under 2008, 2020, and 2022 historical crises.
    """
    capital = float(payload.get("capital", 500000))
    allocations = payload.get("allocation", [])
    return run_portfolio_stress_test(capital, allocations)

from app.services.tax_service import calculate_tax_loss_harvesting
from app.services.backtest_service import run_historical_backtest

@router.post("/api/portfolio/tax-harvesting")
async def tax_harvesting_endpoint(payload: Dict[str, Any]):
    """
    Computes tax savings achieved by offset harvesting unrealized losses.
    """
    gains = float(payload.get("realized_gains", 100000))
    losses = float(payload.get("unrealized_losses", 40000))
    days = int(payload.get("holding_period_days", 180))
    return calculate_tax_loss_harvesting(gains, losses, days)

@router.post("/api/portfolio/backtest")
async def backtest_endpoint(payload: Dict[str, Any]):
    """
    Executes a 10-year historical backtest (2015-2025) on allocation weights with rebalance fee drag.
    """
    capital = float(payload.get("capital", 500000))
    allocation = payload.get("allocation", [])
    return run_historical_backtest(capital, allocation)


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
        has_any_data = any(session.get(k) for k in ["capital", "monthly_investment", "risk_appetite", "preferred_tools"])
        if not has_any_data and not entities:
            return ChatResponse(response_type="text", content="What is the total capital (or monthly SIP) you would like to allocate?")

        try:
            raw_cap = session.get("capital")
            raw_monthly = session.get("monthly_investment")
            
            if not raw_cap and raw_monthly:
                capital_val = int(raw_monthly) * 12
                monthly_val = int(raw_monthly)
            elif raw_cap:
                capital_val = int(raw_cap)
                monthly_val = int(raw_monthly) if raw_monthly else int(capital_val * 0.05)
            else:
                capital_val = 100000
                monthly_val = 5000

            risk_val = str(session.get("risk_appetite", "medium"))
            preferred_tools = session.get("preferred_tools", ["Equity Funds", "Debt"])
            if isinstance(preferred_tools, str):
                preferred_tools_list = [t.strip() for t in preferred_tools.split(",") if t.strip()]
            elif isinstance(preferred_tools, list):
                preferred_tools_list = preferred_tools
            else:
                preferred_tools_list = ["Equity Funds", "Debt"]

            portfolio_req = PortfolioRequest(
                capital=capital_val,
                monthly_investment=monthly_val,
                risk_appetite=risk_val,
                preferred_tools=preferred_tools_list,
            )
        except Exception:
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