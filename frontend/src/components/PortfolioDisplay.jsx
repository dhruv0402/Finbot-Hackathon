import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../theme';
import { AllocationPieChart } from './AllocationPieChart';

const PortfolioContainer = styled.div`
  width: 100%;
  padding: 1.25rem;
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.text};
  margin-bottom: 1rem;
  font-family: ${theme.fonts.primary};
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${theme.colors.border};
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;

  h3 {
    font-size: 1rem;
    font-weight: 700;
    color: ${theme.colors.textHeadline};
    font-family: ${theme.fonts.mono};
    letter-spacing: 0.05em;
  }

  .badge {
    font-size: 0.75rem;
    font-family: ${theme.fonts.mono};
    padding: 0.2rem 0.5rem;
    background-color: #1e293b;
    color: ${theme.colors.primary};
    border: 1px solid ${theme.colors.borderLight};
    text-transform: uppercase;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.25rem;

  @media (max-width: 800px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MetricBox = styled.div`
  background-color: #0f172a;
  border: 1px solid ${theme.colors.border};
  padding: 0.6rem;
  text-align: left;

  .m-label {
    font-size: 0.65rem;
    color: ${theme.colors.textMuted};
    font-family: ${theme.fonts.mono};
    text-transform: uppercase;
  }

  .m-val {
    font-size: 1rem;
    font-weight: 700;
    color: ${props => props.color || theme.colors.textHeadline};
    font-family: ${theme.fonts.mono};
    margin-top: 0.2rem;
  }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  font-family: ${theme.fonts.mono};

  th, td {
    padding: 0.6rem;
    text-align: left;
    border-bottom: 1px solid ${theme.colors.border};
  }

  th {
    color: ${theme.colors.textMuted};
    background-color: #0f172a;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.7rem;
  }

  tr:hover {
    background-color: #1a2333;
  }
`;

const NotesBox = styled.div`
  margin-top: 1rem;
  background-color: #0f172a;
  border: 1px solid ${theme.colors.border};
  padding: 0.8rem;
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};

  .title {
    font-weight: 700;
    color: ${theme.colors.warning};
    font-family: ${theme.fonts.mono};
    font-size: 0.75rem;
    margin-bottom: 0.4rem;
  }

  ul {
    padding-left: 1.2rem;
    margin: 0;
  }
  li {
    margin-bottom: 0.25rem;
  }
`;

export const PortfolioDisplay = ({ text = "INSTITUTIONAL ASSET ALLOCATION", data }) => {
  if (!data || !data.allocation) return null;

  const metrics = data.metrics || {
    sharpe_ratio: 1.52,
    expected_annual_return_pct: 10.8,
    annual_volatility_pct: 9.4,
    max_drawdown_pct: 10.4,
    var_95_pct: 6.2,
    beta_vs_market: 0.72
  };

  return (
    <PortfolioContainer>
      <HeaderRow>
        <h3>{text}</h3>
        <span className="badge">RISK TARGET: {(data.risk_profile || "MEDIUM").toUpperCase()}</span>
      </HeaderRow>

      <MetricsGrid>
        <MetricBox color={theme.colors.primary}>
          <div className="m-label">Sharpe Ratio</div>
          <div className="m-val">{metrics.sharpe_ratio}</div>
        </MetricBox>
        <MetricBox color={theme.colors.accent}>
          <div className="m-label">Target Yield</div>
          <div className="m-val">{data.projected_return_estimate || `${metrics.expected_annual_return_pct}%`}</div>
        </MetricBox>
        <MetricBox color={theme.colors.warning}>
          <div className="m-label">Volatility</div>
          <div className="m-val">{metrics.annual_volatility_pct}%</div>
        </MetricBox>
        <MetricBox>
          <div className="m-label">VaR (95%)</div>
          <div className="m-val">{metrics.var_95_pct}%</div>
        </MetricBox>
        <MetricBox>
          <div className="m-label">Max Drawdown</div>
          <div className="m-val">-{metrics.max_drawdown_pct}%</div>
        </MetricBox>
        <MetricBox>
          <div className="m-label">Beta vs Mkt</div>
          <div className="m-val">{metrics.beta_vs_market}</div>
        </MetricBox>
      </MetricsGrid>

      <TwoCol>
        <div>
          <AllocationPieChart 
            allocationData={data.allocation} 
            projectedReturn={data.projected_return_estimate || "10.8%"}
          />
        </div>

        <div>
          <Table>
            <thead>
              <tr>
                <th>Asset Class</th>
                <th>Allocation</th>
                <th>Target Amount</th>
                <th>Top Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {data.allocation.map((item, idx) => {
                const name = item.asset_class || item.type;
                const pct = typeof item.percentage === 'number' 
                  ? (item.percentage > 1 ? item.percentage : item.percentage * 100) 
                  : 0;
                const rec = item.recommendations && item.recommendations.length > 0 ? item.recommendations[0].name : "Standard Fund";
                return (
                  <tr key={idx}>
                    <td style={{ color: theme.colors.textHeadline, fontWeight: 600 }}>{name}</td>
                    <td style={{ color: theme.colors.primary }}>{pct.toFixed(1)}%</td>
                    <td>₹{item.amount ? item.amount.toLocaleString() : 'N/A'}</td>
                    <td style={{ color: theme.colors.textMuted }}>{rec}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </TwoCol>

      {data.rebalance_notes && data.rebalance_notes.length > 0 && (
        <NotesBox>
          <div className="title">REBALANCING & RISK DIRECTIVES</div>
          <ul>
            {data.rebalance_notes.map((n, idx) => (
              <li key={idx}>{n}</li>
            ))}
          </ul>
        </NotesBox>
      )}
    </PortfolioContainer>
  );
};
