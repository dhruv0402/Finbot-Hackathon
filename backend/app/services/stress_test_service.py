from typing import Dict, Any, List

CRISIS_SCENARIOS = [
    {
        "id": "gfc_2008",
        "name": "2008 Global Financial Crisis",
        "period": "Sept 2008 – March 2009",
        "asset_shocks": {
            "Direct Equity": -0.525,
            "Equity Funds": -0.445,
            "Debt Instruments": +0.085,
            "Gold": +0.210
        },
        "description": "Subprime liquidity freeze & global systemic equity capitulation."
    },
    {
        "id": "covid_2020",
        "name": "2020 COVID-19 Pandemic Flash Shock",
        "period": "Feb 2020 – March 2020",
        "asset_shocks": {
            "Direct Equity": -0.380,
            "Equity Funds": -0.315,
            "Debt Instruments": +0.042,
            "Gold": +0.128
        },
        "description": "Global economic shutdown shock followed by monetary stimulus recovery."
    },
    {
        "id": "rate_inflation_2022",
        "name": "2022 Global Inflation & Rate Hike Crisis",
        "period": "Jan 2022 – Dec 2022",
        "asset_shocks": {
            "Direct Equity": -0.245,
            "Equity Funds": -0.198,
            "Debt Instruments": -0.048,
            "Gold": -0.015
        },
        "description": "Aggressive central bank rate hikes & multi-asset valuation compression."
    }
]

def run_portfolio_stress_test(capital: float, allocations: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Simulates historical market drawdowns on portfolio weights.
    """
    results = []

    for scenario in CRISIS_SCENARIOS:
        shocks = scenario["asset_shocks"]
        total_impact_pct = 0.0

        for item in allocations:
            asset_class = item.get("asset_class", item.get("type", "Equity Funds"))
            pct = item.get("percentage", 0.25)
            if pct > 1.0:
                pct = pct / 100.0
            
            shock_pct = shocks.get(asset_class, shocks.get("Equity Funds", -0.30))
            total_impact_pct += pct * shock_pct

        drawdown_amount = round(capital * abs(total_impact_pct), 2)
        post_crisis_value = round(capital * (1.0 + total_impact_pct), 2)

        # Estimate recovery time in months based on drawdown severity
        recovery_months = int(abs(total_impact_pct) * 45) + 3

        results.append({
            "scenario_id": scenario["id"],
            "name": scenario["name"],
            "period": scenario["period"],
            "description": scenario["description"],
            "portfolio_impact_pct": round(total_impact_pct * 100, 2),
            "drawdown_amount": drawdown_amount,
            "post_crisis_value": post_crisis_value,
            "estimated_recovery_months": recovery_months
        })

    return {
        "initial_capital": capital,
        "stress_test_scenarios": results
    }
