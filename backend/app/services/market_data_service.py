import random
import time
from typing import List, Dict, Any

MARKET_TICKERS = [
    {"symbol": "NIFTY50", "name": "Nifty 50 Index", "price": 24850.40, "change": +142.10, "change_pct": +0.58, "category": "Index"},
    {"symbol": "SPX", "name": "S&P 500", "price": 5648.20, "change": +24.80, "change_pct": +0.44, "category": "Index"},
    {"symbol": "NDX", "name": "Nasdaq 100", "price": 19780.15, "change": +185.30, "change_pct": +0.95, "category": "Index"},
    {"symbol": "NVDA", "name": "NVIDIA Corp", "price": 128.45, "change": +3.25, "change_pct": +2.60, "category": "Equity"},
    {"symbol": "AAPL", "name": "Apple Inc", "price": 224.10, "change": -0.85, "change_pct": -0.38, "category": "Equity"},
    {"symbol": "RELIANCE", "name": "Reliance Industries", "price": 2980.50, "change": +38.20, "change_pct": +1.30, "category": "Equity"},
    {"symbol": "BTCUSD", "name": "Bitcoin / USD", "price": 64250.00, "change": +1240.00, "change_pct": +1.97, "category": "Crypto"},
    {"symbol": "ETHUSD", "name": "Ethereum / USD", "price": 3480.25, "change": +85.40, "change_pct": +2.52, "category": "Crypto"},
    {"symbol": "GOLD", "name": "Spot Gold (oz)", "price": 2504.80, "change": +12.30, "change_pct": +0.49, "category": "Commodity"}
]

def get_live_tickers() -> List[Dict[str, Any]]:
    """
    Returns current ticker prices with small jitter to simulate live streaming tick updates.
    """
    updated_tickers = []
    for item in MARKET_TICKERS:
        jitter_pct = random.uniform(-0.001, 0.001)
        new_price = round(item["price"] * (1 + jitter_pct), 2)
        diff = round(new_price - item["price"], 2)
        
        base_price = item["price"]
        sparkline = []
        curr = base_price * 0.99
        for _ in range(12):
            curr += random.uniform(-base_price * 0.004, base_price * 0.005)
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
