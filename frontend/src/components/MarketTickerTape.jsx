import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { theme } from '../theme';
import { getApiBase } from '../services/apiConfig';

const TickerBar = styled.div`
  background-color: #070a11;
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  overflow-x: auto;
  white-space: nowrap;
  padding: 0.45rem 1rem;
  font-family: ${theme.fonts.mono};
  font-size: 0.75rem;
  user-select: none;
`;

const StationBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-right: 1rem;
  margin-right: 1rem;
  border-right: 1px solid ${theme.colors.border};
  font-weight: 700;
  color: ${theme.colors.primary};
  letter-spacing: 0.05em;

  .dot {
    width: 6px;
    height: 6px;
    background-color: ${theme.colors.accent};
  }
`;

const TickerItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-right: 1.5rem;

  .symbol {
    color: ${theme.colors.textHeadline};
    font-weight: 600;
  }

  .price {
    color: ${theme.colors.text};
  }

  .change {
    font-weight: 600;
    &.positive {
      color: ${theme.colors.accent};
    }
    &.negative {
      color: ${theme.colors.danger};
    }
  }
`;

const FALLBACK_TICKERS = [
  { symbol: 'NIFTY 50', price: 24206.35, change: 7.28, change_pct: 0.72 },
  { symbol: 'SENSEX', price: 77367.01, change: 9.19, change_pct: 0.22 },
  { symbol: 'RELIANCE', price: 1323.42, change: 10.68, change_pct: 0.61 },
  { symbol: 'TCS', price: 2287.83, change: 14.31, change_pct: 0.31 },
  { symbol: 'HDFCBANK', price: 723.95, change: 6.71, change_pct: 0.42 },
  { symbol: 'INFY', price: 1115.57, change: 8.99, change_pct: 0.25 },
  { symbol: 'ICICIBANK', price: 1240.21, change: 13.21, change_pct: 0.22 },
  { symbol: 'GOLD (10g)', price: 126.49, change: 11.62, change_pct: 0.63 }
];

export const MarketTickerTape = () => {
  const [tickers, setTickers] = useState(FALLBACK_TICKERS);

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const res = await axios.get(`${getApiBase()}/api/market/tickers`);
        if (res.data && res.data.tickers) {
          setTickers(res.data.tickers);
        }
      } catch (err) {
        // Fallback initialized
      }
    };
    fetchTickers();
    const interval = setInterval(fetchTickers, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TickerBar>
      <StationBadge>
        <div className="dot" />
        INDIAN MARKETS (NSE/BSE)
      </StationBadge>
      {tickers.map((t) => {
        const isPos = t.change_pct >= 0;
        return (
          <TickerItem key={t.symbol}>
            <span className="symbol">{t.symbol}</span>
            <span className="price">₹{typeof t.price === 'number' ? t.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : t.price}</span>
            <span className={`change ${isPos ? 'positive' : 'negative'}`}>
              {isPos ? '+' : ''}{t.change_pct}%
            </span>
          </TickerItem>
        );
      })}
    </TickerBar>
  );
};
