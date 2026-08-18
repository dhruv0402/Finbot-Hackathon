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
  { symbol: 'NIFTY 50', price: 24850.40, change: 142.10, change_pct: 0.58 },
  { symbol: 'SENSEX', price: 81320.15, change: 340.50, change_pct: 0.42 },
  { symbol: 'BANK NIFTY', price: 52410.80, change: 338.20, change_pct: 0.65 },
  { symbol: 'RELIANCE', price: 2980.50, change: 38.20, change_pct: 1.30 },
  { symbol: 'TCS', price: 4215.00, change: 35.50, change_pct: 0.85 },
  { symbol: 'HDFCBANK', price: 1642.30, change: -7.40, change_pct: -0.45 },
  { symbol: 'INFY', price: 1860.20, change: 20.20, change_pct: 1.10 },
  { symbol: 'TATAMOTORS', price: 1085.40, change: 22.80, change_pct: 2.15 },
  { symbol: 'GOLD 10g', price: 72450.00, change: 360.00, change_pct: 0.50 }
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
