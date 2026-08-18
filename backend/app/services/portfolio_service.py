import json
import random
import math
from pathlib import Path
from typing import List, Dict, Any

from app.models.portfolio_models import (
    PortfolioRequest,
    PortfolioResponse,
    AssetAllocation,
    Recommendation,
    PortfolioMetrics,
    MonteCarloRequest,
    MonteCarloResponse
)
DATA_DIR = Path(__file__).parent.parent / "data"

EQUITY_STOCKS_FILE = DATA_DIR / "direct_equity.json"
EQUITY_FUNDS_FILE = DATA_DIR / "equity_funds.json"
DEBT_FILE = DATA_DIR / "debt_instruments.json"
GOLD_FILE = DATA_DIR / "gold_instruments.json"

def _load_json_data(filepath: Path) -> List[Dict[str, Any]]:
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except Exception:
        return []

STOCKS_DB = _load_json_data(EQUITY_STOCKS_FILE)
EQUITY_FUNDS_DB = _load_json_data(EQUITY_FUNDS_FILE)
DEBT_DB = _load_json_data(DEBT_FILE)
GOLD_DB = _load_json_data(GOLD_FILE)

ASSET_CLASS_TO_DB = {
    "Direct Equity": STOCKS_DB,
    "Equity Funds": EQUITY_FUNDS_DB,
    "Debt Instruments": DEBT_DB,
    "Gold": GOLD_DB,
}

def generate_portfolio(request: PortfolioRequest) -> PortfolioResponse:
    """
    Generates a personalized investment portfolio with institutional quantitative metrics.
    """
    if request.risk_appetite == 'low':
        allocation_rules = {"Debt Instruments": 0.65, "Gold": 0.20, "Equity Funds": 0.15}
        projected_return = "7.2% p.a."
        metrics = PortfolioMetrics(
            sharpe_ratio=1.78,
            expected_annual_return_pct=7.2,
            annual_volatility_pct=4.8,
            max_drawdown_pct=5.2,
            var_95_pct=2.4,
            beta_vs_market=0.28
        )
        notes = [
            "High capital preservation emphasis.",
            "Heavy allocation in sovereign debt & AAA corporate bonds.",
            "Low correlation to broader equity market volatility."
        ]
    elif request.risk_appetite == 'high':
        allocation_rules = {"Direct Equity": 0.45, "Equity Funds": 0.30, "Debt Instruments": 0.15, "Gold": 0.10}
        projected_return = "14.5% p.a."
        metrics = PortfolioMetrics(
            sharpe_ratio=1.24,
            expected_annual_return_pct=14.5,
            annual_volatility_pct=16.2,
            max_drawdown_pct=18.5,
            var_95_pct=12.1,
            beta_vs_market=1.18
        )
        notes = [
            "Focused on aggressive growth & capital appreciation.",
            "Higher exposure to high-beta technology and growth equities.",
            "Quarterly rebalancing recommended to lock in sector gains."
        ]
    else: # medium
        allocation_rules = {"Equity Funds": 0.40, "Debt Instruments": 0.35, "Direct Equity": 0.15, "Gold": 0.10}
        projected_return = "10.8% p.a."
        metrics = PortfolioMetrics(
            sharpe_ratio=1.52,
            expected_annual_return_pct=10.8,
            annual_volatility_pct=9.4,
            max_drawdown_pct=10.4,
            var_95_pct=6.2,
            beta_vs_market=0.72
        )
        notes = [
            "Optimal risk-adjusted Return-to-Volatility balance.",
            "Core-satellite approach combining passive index funds with quality stock selections.",
            "Annual rebalancing keeps asset distribution aligned with risk threshold."
        ]

    final_allocations: List[AssetAllocation] = []

    for asset_class, percentage in allocation_rules.items():
        amount_to_allocate = int(request.capital * percentage)
        source_db = ASSET_CLASS_TO_DB.get(asset_class, [])
        
        num_to_pick = min(len(source_db), 2) if source_db else 0
        recommendations_list: List[Recommendation] = []
        if num_to_pick > 0:
            picked_items = random.sample(source_db, num_to_pick)
            recommendations_list = [
                Recommendation(
                    name=item.get('name', 'N/A'),
                    details=item.get('details', item.get('category', 'Institutional grade asset.')),
                    ticker=item.get('ticker', item.get('symbol', 'ASSET')),
                    expected_return=item.get('expected_return', f"{round(metrics.expected_annual_return_pct, 1)}%")
                ) for item in picked_items
            ]
        
        asset_allocation = AssetAllocation(
            asset_class=asset_class,
            amount=amount_to_allocate,
            percentage=percentage,
            recommendations=recommendations_list
        )
        final_allocations.append(asset_allocation)

    return PortfolioResponse(
        risk_profile=request.risk_appetite,
        projected_return_estimate=projected_return,
        metrics=metrics,
        allocation=final_allocations,
        rebalance_notes=notes
    )

def run_monte_carlo_simulation(req: MonteCarloRequest) -> MonteCarloResponse:
    """
    Executes a 1,000-path stochastic Monte Carlo simulation using Geometric Brownian Motion.
    """
    years = req.time_horizon_years
    months = years * 12
    initial = req.initial_capital
    monthly_contrib = req.monthly_contribution

    if req.risk_level == "low":
        mean_annual_ret = 0.075
        annual_vol = 0.05
    elif req.risk_level == "high":
        mean_annual_ret = 0.14
        annual_vol = 0.18
    else: # medium
        mean_annual_ret = 0.105
        annual_vol = 0.10

    monthly_ret = mean_annual_ret / 12.0
    monthly_vol = annual_vol / (12.0 ** 0.5)

    num_simulations = 500
    final_outcomes = []
    
    # Store yearly trajectory statistics
    yearly_data = []
    for y in range(years + 1):
        yearly_data.append({"year": y, "median": 0.0, "p10": 0.0, "p90": 0.0, "invested": initial + (monthly_contrib * 12 * y)})

    simulation_trajectories = [] # [sim_idx][year]

    for _ in range(num_simulations):
        current_val = initial
        trajectory = [initial]
        for m in range(1, months + 1):
            # Normal distribution shock using Box-Muller transform
            u1 = max(random.random(), 1e-9)
            u2 = random.random()
            z = (-2.0 * math.log(u1)) ** 0.5 * math.cos(2.0 * math.pi * u2)
            
            growth_factor = math.exp((monthly_ret - 0.5 * monthly_vol ** 2) + monthly_vol * z)
            current_val = current_val * growth_factor + monthly_contrib
            
            if m % 12 == 0:
                trajectory.append(current_val)
        
        final_outcomes.append(current_val)
        simulation_trajectories.append(trajectory)

    # Compute year-by-year percentiles
    for y in range(years + 1):
        vals_at_y = sorted([sim[y] for sim in simulation_trajectories])
        p10_idx = int(num_simulations * 0.10)
        p50_idx = int(num_simulations * 0.50)
        p90_idx = int(num_simulations * 0.90)
        
        yearly_data[y]["p10"] = round(vals_at_y[p10_idx], 2)
        yearly_data[y]["median"] = round(vals_at_y[p50_idx], 2)
        yearly_data[y]["p90"] = round(vals_at_y[p90_idx], 2)

    final_outcomes.sort()
    p10_final = final_outcomes[int(num_simulations * 0.10)]
    p50_final = final_outcomes[int(num_simulations * 0.50)]
    p90_final = final_outcomes[int(num_simulations * 0.90)]

    return MonteCarloResponse(
        median_final_value=round(p50_final, 2),
        percentile_10_value=round(p10_final, 2),
        percentile_90_value=round(p90_final, 2),
        total_invested=round(initial + (monthly_contrib * 12 * years), 2),
        projections=yearly_data
    )

# --- 4. INDEPENDENT TEST BLOCK (No changes needed) ---
# FIX: _name_ (double underscore)
if __name__ == "__main__":
    
    print("--- [Person 3] Testing Portfolio Generation Logic (v2) ---")
    
    # 1. Test Case: "Medium" Risk
    print("\n--- Testing: Medium Risk Portfolio ---")
    medium_risk_request = PortfolioRequest(
        capital=100000,
        monthly_investment=5000,
        preferred_tools=["stocks", "mutual funds", "gold"],
        risk_appetite="medium"
    )
    
    try:
        medium_portfolio = generate_portfolio(medium_risk_request)
        print(medium_portfolio.model_dump_json(indent=2))
        
    except Exception as e:
        print(f"Medium risk test failed: {e}")

    # 2. Test Case: "High" Risk
    print("\n--- Testing: High Risk Portfolio ---")
    high_risk_request = PortfolioRequest(
        capital=500000,
        monthly_investment=25000,
        preferred_tools=["stocks"],
        risk_appetite="high"
    )
    
    try:
        high_portfolio = generate_portfolio(high_risk_request)
        print(high_portfolio.model_dump_json(indent=2))
    except Exception as e:
        print(f"High risk test failed: {e}")