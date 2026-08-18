import asyncio
import unittest
from pydantic import ValidationError
from app.models.portfolio_models import PortfolioRequest, MonteCarloRequest
from app.services.portfolio_service import generate_portfolio, run_monte_carlo_simulation
from app.services.market_data_service import get_live_tickers
from app.services import llm_service
from app.services.mpt_service import compute_efficient_frontier
from app.services.stress_test_service import run_portfolio_stress_test
from app.services.pdf_report_service import generate_institutional_report_html

class TestFinBotQuantSuite(unittest.TestCase):

    def test_portfolio_math(self):
        req = PortfolioRequest(
            capital=500000,
            monthly_investment=20000,
            preferred_tools=["Direct Equity", "Equity Funds"],
            risk_appetite="high"
        )
        res = generate_portfolio(req)
        self.assertGreater(res.metrics.sharpe_ratio, 0)
        self.assertGreater(res.metrics.expected_annual_return_pct, 0)
        self.assertGreater(len(res.allocation), 0)

    def test_monte_carlo(self):
        mc_req = MonteCarloRequest(
            initial_capital=100000,
            monthly_contribution=10000,
            time_horizon_years=10,
            risk_level="medium"
        )
        mc_res = run_monte_carlo_simulation(mc_req)
        self.assertGreater(mc_res.median_final_value, mc_res.total_invested)
        self.assertEqual(len(mc_res.projections), 11)

    def test_market_tickers(self):
        tickers = get_live_tickers()
        self.assertGreaterEqual(len(tickers), 8)
        self.assertIn("sparkline", tickers[0])

    def test_llm_fallback(self):
        async def run():
            intent_res = await llm_service.classify_intent_and_extract("I want to invest 200000 INR with medium risk in mutual funds")
            self.assertIn(intent_res["intent"], ["portfolio_request", "general_question"])
            self.assertEqual(intent_res["entities"].get("capital"), 200000)
        asyncio.run(run())

    def test_mpt(self):
        mpt_res = compute_efficient_frontier()
        self.assertGreater(len(mpt_res["efficient_frontier"]), 5)
        self.assertGreater(mpt_res["max_sharpe_portfolio"]["sharpe_ratio"], 0)

    def test_stress_test(self):
        allocations = [
            {"asset_class": "Equity Funds", "percentage": 0.40},
            {"asset_class": "Debt Instruments", "percentage": 0.35},
            {"asset_class": "Direct Equity", "percentage": 0.15},
            {"asset_class": "Gold", "percentage": 0.10}
        ]
        st_res = run_portfolio_stress_test(500000, allocations)
        self.assertEqual(len(st_res["stress_test_scenarios"]), 3)

    def test_pdf_report(self):
        data = {
            "capital": 500000,
            "risk_profile": "medium",
            "projected_return_estimate": "10.8% p.a.",
            "metrics": {"sharpe_ratio": 1.52, "annual_volatility_pct": 9.4},
            "allocation": [{"asset_class": "Equity Funds", "percentage": 0.40, "amount": 200000}]
        }
        html = generate_institutional_report_html(data)
        self.assertIn("FINBOT AI WEALTH DESK", html)
        self.assertIn("₹500,000", html)

    def test_edge_cases(self):
        """
        Verifies Pydantic v2 strict input bounds (raising ValidationError on negative values)
        and degenerate single-asset scenario evaluation.
        """
        # Negative capital input must raise Pydantic ValidationError
        with self.assertRaises(ValidationError):
            PortfolioRequest(capital=-50000, monthly_investment=-1000, risk_appetite="medium")

        # Single-asset degenerate allocation test
        alloc_single = [{"asset_class": "Equity Funds", "percentage": 1.0}]
        st_single = run_portfolio_stress_test(100000, alloc_single)
        self.assertEqual(len(st_single["stress_test_scenarios"]), 3)

if __name__ == "__main__":
    unittest.main()
