import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { theme } from '../theme';

const TickerBar = styled.div`
  background-color: #070a11;
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  overflow-x: auto;
  white-space: nowrap;
  padding: 0.4rem 1rem;
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
  font-weight: 600;
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
    font-weight: 500;
    &.positive {
      color: ${theme.colors.accent};
    }
    &.negative {
      color: ${theme.colors.danger};
    }
  }
`;

const FALLBACK_TICKERS = [
  { symbol: 'NIFTY50', price: 24850.40, change: 142.10, change_pct: 0.58 },
  { symbol: 'SPX', price: 5648.20, change: 24.80, change_pct: 0.44 },
  { symbol: 'NDX', price: 19780.15, change: 185.30, change_pct: 0.95 },
  { symbol: 'NVDA', price: 128.45, change: 3.25, change_pct: 2.60 },
  { symbol: 'AAPL', price: 224.10, change: -0.85, change_pct: -0.38 },
  { symbol: 'BTCUSD', price: 64250.00, change: 1240.00, change_pct: 1.97 },
  { symbol: 'GOLD', price: 2504.80, change: 12.30, change_pct: 0.49 }
];

export const MarketTickerTape = () => {
  const [tickers, setTickers] = useState(FALLBACK_TICKERS);

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/market/tickers');
        if (res.data && res.data.tickers) {
          setTickers(res.data.tickers);
        }
      } catch (err) {
        // use fallback if backend is starting up
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
        LIVE MARKETS
      </StationBadge>
      {tickers.map((t) => {
        const isPos = t.change_pct >= 0;
        return (
          <TickerItem key={t.symbol}>
            <span className="symbol">{t.symbol}</span>
            <span className="price">${typeof t.price === 'number' ? t.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : t.price}</span>
            <span className={`change ${isPos ? 'positive' : 'negative'}`}>
              {isPos ? '+' : ''}{t.change_pct}%
            </span>
          </TickerItem>
        );
      })}
    </TickerBar>
  );
};
