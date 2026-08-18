import asyncio
import json
from app.models.portfolio_models import PortfolioRequest, MonteCarloRequest
from app.services.portfolio_service import generate_portfolio, run_monte_carlo_simulation
from app.services.market_data_service import get_live_tickers
from app.services import llm_service

def test_portfolio_math():
    print("--- [TEST 1] Portfolio Math & Metrics ---")
    req = PortfolioRequest(
        capital=500000,
        monthly_investment=20000,
        preferred_tools=["Direct Equity", "Equity Funds"],
        risk_appetite="high"
    )
    res = generate_portfolio(req)
    assert res.metrics.sharpe_ratio > 0
    assert res.metrics.expected_annual_return_pct > 0
    assert len(res.allocation) > 0
    print(f"✅ High Risk Portfolio generated with Sharpe {res.metrics.sharpe_ratio} & Return {res.projected_return_estimate}")

def test_monte_carlo():
    print("\n--- [TEST 2] Monte Carlo Simulation ---")
    mc_req = MonteCarloRequest(
        initial_capital=100000,
        monthly_contribution=10000,
        time_horizon_years=10,
        risk_level="medium"
    )
    mc_res = run_monte_carlo_simulation(mc_req)
    assert mc_res.median_final_value > mc_res.total_invested
    assert len(mc_res.projections) == 11
    print(f"✅ Monte Carlo 10-Yr Median Output: INR {mc_res.median_final_value:,.2f} vs Invested INR {mc_res.total_invested:,.2f}")

def test_market_tickers():
    print("\n--- [TEST 3] Market Tickers Feed ---")
    tickers = get_live_tickers()
    assert len(tickers) >= 8
    assert "sparkline" in tickers[0]
    print(f"✅ Fetched {len(tickers)} live market tickers with sparklines")

async def test_llm_fallback():
    print("\n--- [TEST 4] LLM Intent & Fallback ---")
    intent_res = await llm_service.classify_intent_and_extract("I want to invest 200000 INR with medium risk in mutual funds")
    assert intent_res["intent"] in ["portfolio_request", "general_question"]
    assert intent_res["entities"].get("capital") == 200000
    print(f"✅ Extracted entities: {intent_res['entities']}")

if __name__ == "__main__":
    test_portfolio_math()
    test_monte_carlo()
    test_market_tickers()
    asyncio.run(test_llm_fallback())
    print("\n🎉 ALL BACKEND TESTS PASSED!")
