import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../theme';
import { getApiBase } from '../services/apiConfig';

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  padding: 1.25rem;

  .badge-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .badge {
    font-size: 0.65rem;
    font-family: ${theme.fonts.mono};
    padding: 0.15rem 0.5rem;
    border: 1px solid ${theme.colors.borderLight};
    background: #0f172a;
    color: ${theme.colors.primary};
  }

  .badge-green {
    border-color: ${theme.colors.accent};
    color: ${theme.colors.accent};
  }

  h2 {
    font-size: 1.25rem;
    font-family: ${theme.fonts.mono};
    color: ${theme.colors.textHeadline};
    margin: 0 0 0.4rem 0;
  }

  p {
    font-size: 0.85rem;
    color: ${theme.colors.textMuted};
    margin: 0;
    line-height: 1.4;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 1.25rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.div`
  font-family: ${theme.fonts.mono};
  font-size: 0.85rem;
  font-weight: 700;
  color: ${theme.colors.textHeadline};
  border-bottom: 1px solid ${theme.colors.border};
  padding-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AuditInputArea = styled.textarea`
  width: 100%;
  height: 90px;
  background: #0f172a;
  border: 1px solid ${theme.colors.borderLight};
  color: ${theme.colors.text};
  font-family: ${theme.fonts.mono};
  font-size: 0.8rem;
  padding: 0.75rem;
  box-sizing: border-box;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    font-family: ${theme.fonts.mono};
    color: ${theme.colors.textMuted};
    cursor: pointer;
  }
`;

const AuditButton = styled.button`
  background: ${theme.colors.primary};
  color: #0b0f17;
  border: none;
  font-family: ${theme.fonts.mono};
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.6rem 1.2rem;
  cursor: pointer;

  &:hover {
    background: #38bdf8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultCard = styled.div`
  background: #0f172a;
  border: 1px solid ${props => props.isApproved ? theme.colors.accent : (props.isCaution ? theme.colors.warning : theme.colors.danger)};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-family: ${theme.fonts.mono};

  .status-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .status-tag {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${props => props.isApproved ? theme.colors.accent : (props.isCaution ? theme.colors.warning : theme.colors.danger)};
  }

  .conviction-score {
    font-size: 1.1rem;
    font-weight: 700;
    color: ${theme.colors.textHeadline};
  }

  .metric-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    background: #111827;
    padding: 0.6rem;
    border: 1px solid ${theme.colors.border};
    margin: 0.3rem 0;
  }

  .metric-item {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    .label {
      font-size: 0.65rem;
      color: ${theme.colors.textDim};
    }
    .val {
      font-size: 0.8rem;
      color: ${theme.colors.textHeadline};
      font-weight: 600;
    }
  }

  .verdict {
    font-size: 0.75rem;
    color: ${theme.colors.textMuted};
    line-height: 1.4;
  }
`;

const PresetRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;

  .preset-chip {
    font-size: 0.65rem;
    font-family: ${theme.fonts.mono};
    background: transparent;
    border: 1px solid ${theme.colors.borderLight};
    color: ${theme.colors.textMuted};
    padding: 0.25rem 0.5rem;
    cursor: pointer;

    &:hover {
      color: ${theme.colors.primary};
      border-color: ${theme.colors.primary};
    }
  }
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${theme.fonts.mono};
  font-size: 0.75rem;

  th {
    text-align: left;
    padding: 0.5rem 0.4rem;
    color: ${theme.colors.textDim};
    border-bottom: 1px solid ${theme.colors.border};
    font-weight: 600;
  }

  td {
    padding: 0.55rem 0.4rem;
    border-bottom: 1px solid #1e293b;
    color: ${theme.colors.text};
  }

  .ticker {
    color: ${theme.colors.primary};
    font-weight: 700;
  }

  .sebi-pill {
    font-size: 0.6rem;
    padding: 0.1rem 0.3rem;
    background: #064e3b;
    color: #34d399;
    border: 1px solid #059669;
  }

  .non-sebi-pill {
    font-size: 0.6rem;
    padding: 0.1rem 0.3rem;
    background: #451a03;
    color: #fbbf24;
    border: 1px solid #d97706;
  }
`;

export function MarketProbeAuditWidget() {
  const [inputText, setInputText] = useState("Buy Reliance at 1320 with target 1450 and stoploss 1280");
  const [isSebi, setIsSebi] = useState(true);
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  
  const [topRecs, setTopRecs] = useState([]);
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    fetchTopRecs();
    fetchCreators();
  }, []);

  const fetchTopRecs = async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/audit/top-recommendations?limit=5`);
      const data = await res.json();
      if (data && data.recommendations) {
        setTopRecs(data.recommendations);
      }
    } catch (e) {
      console.error("Top recs fetch:", e);
    }
  };

  const fetchCreators = async () => {
    try {
      const res = await fetch(`${getApiBase()}/api/audit/creators?limit=6`);
      const data = await res.json();
      if (data && data.creators) {
        setCreators(data.creators);
      }
    } catch (e) {
      console.error("Creators fetch:", e);
    }
  };

  const handleAudit = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${getApiBase()}/api/audit/stock-tip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          is_sebi: isSebi
        })
      });
      const data = await res.json();
      setAuditResult(data);
    } catch (e) {
      console.error("Audit error:", e);
    } finally {
      setLoading(false);
    }
  };

  const sampleTips = [
    "Buy TCS at 2280 target 2450 stoploss 2200",
    "Motilal Oswal recommends buy HDFC Bank at 720 target 820 SL 680",
    "Akshat Shrivastava says buy INFY @ 1115 target 1240 SL 1060",
    "Buy 100x multibagger rocket penny stock for 500% profit guarantee"
  ];

  return (
    <WidgetContainer>
      <HeaderCard>
        <div className="badge-row">
          <span className="badge badge-green">BAYESIAN ML CONVICTION ENGINE</span>
          <span className="badge">MARKETPROBE v4.0 INTEGRATION</span>
          <span className="badge">2,559 NSE TICKERS</span>
        </div>
        <h2>Direct Equity Auditor &amp; Alpha Gating Desk</h2>
        <p>
          Live financial recommendation auditor powered by MarketProbe's precision NLP entity extractor
          and XGBoost Bayesian gating model (trained on 995+ audited creator calls, lifting empirical win rate from 40.3% to 75.0%).
        </p>
      </HeaderCard>

      <Grid>
        <Card>
          <SectionTitle>
            <span>[AUDIT REAL-TIME STOCK TIP]</span>
            <span style={{ fontSize: '0.65rem', color: theme.colors.textDim }}>SUB-2MS REGEX FAST-PATH</span>
          </SectionTitle>

          <AuditInputArea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste finfluencer / brokerage tip: e.g. Buy Reliance at 1320 target 1450 stoploss 1280"
          />

          <PresetRow>
            {sampleTips.map((tip, idx) => (
              <button
                key={idx}
                className="preset-chip"
                onClick={() => setInputText(tip)}
              >
                Sample {idx + 1}
              </button>
            ))}
          </PresetRow>

          <FormRow>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isSebi}
                onChange={(e) => setIsSebi(e.target.checked)}
              />
              SEBI Registered Research Analyst (+15% Credibility Factor)
            </label>

            <AuditButton onClick={handleAudit} disabled={loading}>
              {loading ? "EVALUATING..." : "RUN ML AUDIT"}
            </AuditButton>
          </FormRow>

          {auditResult && auditResult.audited && (
            <ResultCard
              isApproved={auditResult.conviction_score_pct >= 65}
              isCaution={auditResult.conviction_score_pct >= 50 && auditResult.conviction_score_pct < 65}
            >
              <div className="status-header">
                <div>
                  <span className="status-tag">{auditResult.status_label}</span>
                  <div style={{ fontSize: '0.85rem', color: theme.colors.textHeadline, marginTop: '0.2rem' }}>
                    {auditResult.company_name} ({auditResult.ticker})
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.65rem', color: theme.colors.textDim }}>AI CONVICTION</div>
                  <div className="conviction-score">{auditResult.conviction_score_pct}%</div>
                </div>
              </div>

              <div className="metric-grid">
                <div className="metric-item">
                  <span className="label">ACTION</span>
                  <span className="val" style={{ color: auditResult.action === 'BUY' ? theme.colors.accent : theme.colors.danger }}>
                    {auditResult.action}
                  </span>
                </div>
                <div className="metric-item">
                  <span className="label">ENTRY</span>
                  <span className="val">₹{auditResult.entry_price}</span>
                </div>
                <div className="metric-item">
                  <span className="label">TARGET</span>
                  <span className="val">₹{auditResult.target_price}</span>
                </div>
                <div className="metric-item">
                  <span className="label">STOPLOSS / RR</span>
                  <span className="val">₹{auditResult.stoploss_price} ({auditResult.risk_reward_ratio}:1)</span>
                </div>
              </div>

              <div className="verdict">
                <strong>Quantitative Verdict:</strong> {auditResult.recommendation_verdict}
              </div>
            </ResultCard>
          )}

          {auditResult && !auditResult.audited && (
            <ResultCard isApproved={false}>
              <span className="status-tag">EXTRACTION FAILURE</span>
              <div className="verdict">{auditResult.message}</div>
            </ResultCard>
          )}
        </Card>

        <Card>
          <SectionTitle>
            <span>[TRACKED FINFLUENCERS &amp; BROKERS]</span>
            <span style={{ fontSize: '0.65rem', color: theme.colors.accent }}>HISTORICAL WIN RATE</span>
          </SectionTitle>

          <DataTable>
            <thead>
              <tr>
                <th>CREATOR / DESK</th>
                <th>SEBI</th>
                <th>TOTAL</th>
                <th>WIN %</th>
              </tr>
            </thead>
            <tbody>
              {creators.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: '0.65rem', color: theme.colors.textDim }}>{c.handle}</div>
                  </td>
                  <td>
                    {c.is_sebi ? (
                      <span className="sebi-pill">SEBI</span>
                    ) : (
                      <span className="non-sebi-pill">UNREG</span>
                    )}
                  </td>
                  <td>{c.total_calls}</td>
                  <td style={{ fontWeight: 700, color: c.win_rate_pct >= 40 ? theme.colors.accent : theme.colors.danger }}>
                    {c.win_rate_pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </Card>
      </Grid>

      <Card>
        <SectionTitle>
          <span>[TOP HISTORICAL HIGH-ALPHA AUDITED TRADES IN DB]</span>
          <span style={{ fontSize: '0.65rem', color: theme.colors.primary }}>POPULATES FINBOT DIRECT EQUITY SLEEVE</span>
        </SectionTitle>

        <DataTable>
          <thead>
            <tr>
              <th>TICKER / COMPANY</th>
              <th>CREATOR</th>
              <th>ENTRY</th>
              <th>TARGET</th>
              <th>RR RATIO</th>
              <th>PEAK GAIN</th>
              <th>CONVICTION</th>
            </tr>
          </thead>
          <tbody>
            {topRecs.map((r) => (
              <tr key={r.id}>
                <td>
                  <span className="ticker">{r.ticker}</span>
                  <div style={{ fontSize: '0.65rem', color: theme.colors.textDim }}>{r.company_name}</div>
                </td>
                <td>
                  <div>{r.creator}</div>
                  {r.is_sebi && <span className="sebi-pill">SEBI REG</span>}
                </td>
                <td>₹{r.entry_price}</td>
                <td>₹{r.target_price}</td>
                <td>{r.risk_reward_ratio}:1</td>
                <td style={{ color: theme.colors.accent, fontWeight: 700 }}>
                  +{r.historical_peak_return_pct}%
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: theme.colors.textHeadline }}>
                    {r.conviction_score}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </Card>
    </WidgetContainer>
  );
}
