import random
from typing import List, Dict, Any

# Genuine Indian Stock & Index Tickers (NSE/BSE)
INDIAN_MARKET_TICKERS = [
    {"symbol": "NIFTY 50", "name": "NSE Nifty 50 Index", "price": 24850.40, "change": +142.10, "change_pct": +0.58, "category": "Index"},
    {"symbol": "SENSEX", "name": "BSE Sensex Index", "price": 81320.15, "change": +340.50, "change_pct": +0.42, "category": "Index"},
    {"symbol": "BANK NIFTY", "name": "Nifty Bank Index", "price": 52410.80, "change": +338.20, "change_pct": +0.65, "category": "Index"},
    {"symbol": "RELIANCE", "name": "Reliance Industries", "price": 2980.50, "change": +38.20, "change_pct": +1.30, "category": "Stock"},
    {"symbol": "TCS", "name": "Tata Consultancy Services", "price": 4215.00, "change": +35.50, "change_pct": +0.85, "category": "Stock"},
    {"symbol": "HDFCBANK", "name": "HDFC Bank Ltd", "price": 1642.30, "change": -7.40, "change_pct": -0.45, "category": "Stock"},
    {"symbol": "INFY", "name": "Infosys Ltd", "price": 1860.20, "change": +20.20, "change_pct": +1.10, "category": "Stock"},
    {"symbol": "TATAMOTORS", "name": "Tata Motors Ltd", "price": 1085.40, "change": +22.80, "change_pct": +2.15, "category": "Stock"},
    {"symbol": "GOLD 10g", "name": "Spot Gold (24K 10g)", "price": 72450.00, "change": +360.00, "change_pct": +0.50, "category": "Commodity"}
]

def get_live_tickers() -> List[Dict[str, Any]]:
    """
    Returns current Indian market tickers with realistic price simulation and sparklines.
    """
    updated_tickers = []
    for item in INDIAN_MARKET_TICKERS:
        jitter_pct = random.uniform(-0.0008, 0.0008)
        new_price = round(item["price"] * (1 + jitter_pct), 2)
        diff = round(new_price - item["price"], 2)
        
        base_price = item["price"]
        sparkline = []
        curr = base_price * 0.992
        for _ in range(12):
            curr += random.uniform(-base_price * 0.003, base_price * 0.004)
            sparkline.append(round(curr, 2))
            
        updated_tickers.append({
            "symbol": item["symbol"],
            "name": item["name"],
            "price": new_price,
            "change": round(item["change"] + diff, 2),
            "change_pct": round(item["change_pct"] + (jitter_pct * 100), 2),
            "category": item["category"],
            "sparkline": sparkline
        })
    return updated_tickers
