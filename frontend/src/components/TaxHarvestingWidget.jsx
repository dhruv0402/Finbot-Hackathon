import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { theme } from '../theme';

const Container = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Title = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: ${theme.colors.textHeadline};
  font-family: ${theme.fonts.mono};
  border-bottom: 1px solid ${theme.colors.border};
  padding-bottom: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.75rem;
    color: ${theme.colors.textMuted};
    font-family: ${theme.fonts.mono};
    text-transform: uppercase;
  }

  input, select {
    background-color: #0b0f17;
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};
    padding: 0.6rem;
    font-family: ${theme.fonts.mono};
    font-size: 0.85rem;
    outline: none;

    &:focus {
      border-color: ${theme.colors.primary};
    }
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: #0f172a;
  border: 1px solid ${theme.colors.border};
  padding: 0.75rem;

  .s-label {
    font-size: 0.65rem;
    color: ${theme.colors.textMuted};
    font-family: ${theme.fonts.mono};
    text-transform: uppercase;
  }

  .s-val {
    font-size: 1.1rem;
    font-weight: 700;
    color: ${props => props.color || theme.colors.textHeadline};
    font-family: ${theme.fonts.mono};
    margin-top: 0.2rem;
  }
`;

const Banner = styled.div`
  background-color: #0f172a;
  border: 1px solid ${theme.colors.accent};
  padding: 0.8rem 1rem;
  font-family: ${theme.fonts.mono};
  font-size: 0.8rem;
  color: ${theme.colors.accent};
`;

export const TaxHarvestingWidget = () => {
  const [realizedGains, setRealizedGains] = useState(150000);
  const [unrealizedLosses, setUnrealizedLosses] = useState(60000);
  const [holdingDays, setHoldingDays] = useState(180);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const computeTax = async () => {
      try {
        const res = await axios.post('http://localhost:8000/api/portfolio/tax-harvesting', {
          realized_gains: realizedGains,
          unrealized_losses: unrealizedLosses,
          holding_period_days: holdingDays
        });
        setResult(res.data);
      } catch (e) {
        // Fallback calculations
        const rate = holdingDays > 365 ? 0.125 : 0.20;
        const loss = Math.min(realizedGains, unrealizedLosses);
        const saved = loss * rate;
        setResult({
          gain_type: holdingDays > 365 ? "LTCG (12.5%)" : "STCG (20%)",
          tax_rate_pct: rate * 100,
          harvestable_loss_applied: loss,
          tax_before_harvest: realizedGains * rate,
          tax_after_harvest: (realizedGains - loss) * rate,
          tax_saved: saved,
          recommendation: `Harvest ₹${loss.toLocaleString()} of unrealized losses to save ₹${saved.toLocaleString()} in taxes.`
        });
      }
    };
    computeTax();
  }, [realizedGains, unrealizedLosses, holdingDays]);

  return (
    <Container>
      <Title>TAX-LOSS HARVESTING OPTIMIZER (SEC 70/71 INCOME TAX ACT)</Title>

      <FormGrid>
        <FormGroup>
          <label>Realized Capital Gains (₹)</label>
          <input
            type="number"
            value={realizedGains}
            onChange={(e) => setRealizedGains(Number(e.target.value))}
          />
        </FormGroup>

        <FormGroup>
          <label>Unrealized Losses Available (₹)</label>
          <input
            type="number"
            value={unrealizedLosses}
            onChange={(e) => setUnrealizedLosses(Number(e.target.value))}
          />
        </FormGroup>

        <FormGroup>
          <label>Holding Period</label>
          <select value={holdingDays} onChange={(e) => setHoldingDays(Number(e.target.value))}>
            <option value={180}>Short-Term (&lt; 1 Year / STCG 20%)</option>
            <option value={400}>Long-Term (&gt; 1 Year / LTCG 12.5%)</option>
          </select>
        </FormGroup>
      </FormGrid>

      {result && (
        <>
          <ResultsGrid>
            <StatCard>
              <div className="s-label">Classification</div>
              <div className="s-val">{result.gain_type}</div>
            </StatCard>
            <StatCard color={theme.colors.danger}>
              <div className="s-label">Tax Liability Without Harvest</div>
              <div className="s-val">₹{result.tax_before_harvest?.toLocaleString()}</div>
            </StatCard>
            <StatCard color={theme.colors.warning}>
              <div className="s-label">Net Tax Liability After Harvest</div>
              <div className="s-val">₹{result.tax_after_harvest?.toLocaleString()}</div>
            </StatCard>
            <StatCard color={theme.colors.accent}>
              <div className="s-label">Total Tax Saved</div>
              <div className="s-val">₹{result.tax_saved?.toLocaleString()}</div>
            </StatCard>
          </ResultsGrid>

          <Banner>
            ACTION DIRECTIVE: {result.recommendation}
          </Banner>
        </>
      )}
    </Container>
  );
};
