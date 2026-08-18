import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../theme';

const Container = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${theme.colors.textHeadline};
  font-family: ${theme.fonts.mono};
  border-bottom: 1px solid ${theme.colors.border};
  padding-bottom: 0.5rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

const RuleCard = styled.div`
  background-color: #0f172a;
  border: 1px solid ${theme.colors.border};
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .tag {
    font-size: 0.7rem;
    font-family: ${theme.fonts.mono};
    color: ${theme.colors.primary};
    background-color: #1e293b;
    padding: 0.2rem 0.5rem;
    align-self: flex-start;
  }

  .title {
    font-size: 1rem;
    font-weight: 700;
    color: ${theme.colors.textHeadline};
  }

  .desc {
    font-size: 0.85rem;
    color: ${theme.colors.textMuted};
    line-height: 1.5;
  }

  .stat {
    font-family: ${theme.fonts.mono};
    font-size: 1.1rem;
    font-weight: 700;
    color: ${theme.colors.accent};
    margin-top: 0.2rem;
  }
`;

const CalculatorBox = styled.div`
  background-color: #0f172a;
  border: 1px solid ${theme.colors.border};
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }

  label {
    font-size: 0.75rem;
    color: ${theme.colors.textMuted};
    font-family: ${theme.fonts.mono};
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    input, select {
      background-color: #0b0f17;
      color: ${theme.colors.text};
      border: 1px solid ${theme.colors.border};
      padding: 0.6rem;
      font-family: ${theme.fonts.mono};
      font-size: 0.85rem;
      outline: none;
    }
  }
`;

const ResultBanner = styled.div`
  background-color: #0b0f17;
  border: 1px solid ${theme.colors.accent};
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .r-label {
    font-size: 0.85rem;
    color: ${theme.colors.textMuted};
  }

  .r-val {
    font-family: ${theme.fonts.mono};
    font-size: 1.2rem;
    font-weight: 700;
    color: ${theme.colors.accent};
  }
`;

export const TaxHarvestingWidget = () => {
  const [profit, setProfit] = useState(150000);
  const [loss, setLoss] = useState(40000);
  const [term, setTerm] = useState('stcg');

  const taxRate = term === 'stcg' ? 0.20 : 0.125;
  const exemption = term === 'ltcg' ? 125000 : 0;
  
  const taxableProfitWithoutHarvest = Math.max(0, profit - exemption);
  const taxWithoutHarvest = taxableProfitWithoutHarvest * taxRate;

  const harvestableLoss = Math.min(profit, loss);
  const taxableProfitWithHarvest = Math.max(0, profit - harvestableLoss - exemption);
  const taxWithHarvest = taxableProfitWithHarvest * taxRate;

  const taxSaved = Math.max(0, taxWithoutHarvest - taxWithHarvest);

  return (
    <Container>
      <SectionTitle>INDIAN TAX &amp; SAVINGS GUIDE (INCOME TAX ACT RULES)</SectionTitle>

      <CardsGrid>
        <RuleCard>
          <span className="tag">SECTION 80C</span>
          <div className="title">ELSS Tax Saving Mutual Funds</div>
          <div className="desc">Save up to ₹46,800 in tax every year by investing up to ₹1.5 Lakhs in ELSS funds with a 3-year lock-in period.</div>
          <div className="stat">Max Benefit: ₹46,800/yr</div>
        </RuleCard>

        <RuleCard>
          <span className="tag">LTCG (HOLDING &gt; 1 YEAR)</span>
          <div className="title">₹1.25 Lakh Profit Exemption</div>
          <div className="desc">Long-term profits on stocks and equity mutual funds are tax-free up to ₹1.25 Lakhs per financial year. Excess is taxed at 12.5%.</div>
          <div className="stat">100% Tax Free up to ₹1.25L</div>
        </RuleCard>

        <RuleCard>
          <span className="tag">TAX-LOSS HARVESTING</span>
          <div className="title">Offset Losses to Cut Taxes</div>
          <div className="desc">If you have loss-making stocks, sell them before March 31 to offset your realized profits and legally reduce your income tax bill.</div>
          <div className="stat">Instant Tax Offset</div>
        </RuleCard>
      </CardsGrid>

      <CalculatorBox>
        <div style={{ fontFamily: theme.fonts.mono, fontSize: '0.9rem', fontWeight: 700, color: theme.colors.textHeadline }}>
          QUICK TAX SAVINGS CALCULATOR
        </div>

        <FormRow>
          <label>
            Realized Capital Profit (₹)
            <input
              type="number"
              value={profit}
              onChange={(e) => setProfit(Number(e.target.value))}
            />
          </label>

          <label>
            Available Stock Losses (₹)
            <input
              type="number"
              value={loss}
              onChange={(e) => setLoss(Number(e.target.value))}
            />
          </label>

          <label>
            Holding Horizon
            <select value={term} onChange={(e) => setTerm(e.target.value)}>
              <option value="stcg">Short Term (&lt; 1 Year / 20% Tax)</option>
              <option value="ltcg">Long Term (&gt; 1 Year / 12.5% Tax)</option>
            </select>
          </label>
        </FormRow>

        <ResultBanner>
          <div className="r-label">
            By selling ₹{harvestableLoss.toLocaleString('en-IN')} of loss-making holdings before March 31:
          </div>
          <div className="r-val">
            TAX SAVED: ₹{taxSaved.toLocaleString('en-IN')}
          </div>
        </ResultBanner>
      </CalculatorBox>
    </Container>
  );
};
