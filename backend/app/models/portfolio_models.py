from pydantic import BaseModel, Field
from typing import List, Literal, Optional, Dict, Any

class PortfolioRequest(BaseModel):
    capital: int = Field(..., gt=0, description="Total capital amount to invest in INR/USD")
    monthly_investment: int = Field(0, ge=0, description="Additional monthly investment")
    preferred_tools: List[str] = Field(default_factory=list, description="List of preferred tools/instruments")
    risk_appetite: Literal["low", "medium", "high"] = Field(..., description="User's risk tolerance")

class Recommendation(BaseModel):
    name: str
    details: str
    ticker: Optional[str] = None
    expected_return: Optional[str] = None

class AssetAllocation(BaseModel):
    asset_class: str = Field(..., description="e.g., 'Direct Equity', 'Equity Funds', 'Debt Instruments', 'Gold', 'Crypto'")
    amount: int = Field(..., description="Calculated amount for this asset class")
    percentage: float = Field(..., description="Percentage of the total portfolio (0.0 to 1.0)")
    recommendations: List[Recommendation] = Field(..., description="List of specific investment recommendations")

class PortfolioMetrics(BaseModel):
    sharpe_ratio: float
    expected_annual_return_pct: float
    annual_volatility_pct: float
    max_drawdown_pct: float
    var_95_pct: float
    beta_vs_market: float

class PortfolioResponse(BaseModel):
    risk_profile: str
    projected_return_estimate: str
    metrics: PortfolioMetrics
    allocation: List[AssetAllocation]
    rebalance_notes: Optional[List[str]] = None

class MonteCarloRequest(BaseModel):
    initial_capital: float = Field(..., gt=0)
    monthly_contribution: float = Field(0, ge=0)
    time_horizon_years: int = Field(10, ge=1, le=50)
    risk_level: Literal["low", "medium", "high"] = Field("medium")

class MonteCarloResponse(BaseModel):
    median_final_value: float
    percentile_10_value: float
    percentile_90_value: float
    total_invested: float
    projections: List[Dict[str, Any]] # year-by-year milestones