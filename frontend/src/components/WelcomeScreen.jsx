import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 2.5rem;
  background-color: ${theme.colors.background};
`;

const TerminalBox = styled.div`
  max-width: 680px;
  width: 100%;
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  padding: 2rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const TopTag = styled.div`
  font-family: ${theme.fonts.mono};
  font-size: 0.75rem;
  color: ${theme.colors.primary};
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${theme.colors.border};
  padding-bottom: 0.6rem;
`;

const MainHeading = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${theme.colors.textHeadline};
  font-family: ${theme.fonts.mono};
  letter-spacing: -0.02em;
  margin: 0;

  span {
    color: ${theme.colors.primary};
  }
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.textMuted};
  line-height: 1.6;
  margin: 0;
`;

const PresetsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const PresetCard = styled.div`
  background-color: #0b0f17;
  border: 1px solid ${theme.colors.border};
  padding: 0.8rem;
  font-family: ${theme.fonts.mono};
  font-size: 0.8rem;
  cursor: pointer;

  &:hover {
    border-color: ${theme.colors.primary};
  }

  .title {
    color: ${theme.colors.textHeadline};
    font-weight: 600;
    margin-bottom: 0.3rem;
  }
  .sub {
    color: ${theme.colors.textDim};
    font-size: 0.7rem;
  }
`;

const LaunchBtn = styled.button`
  background-color: ${theme.colors.primary};
  color: #000000;
  border: none;
  padding: 0.8rem 1.5rem;
  font-family: ${theme.fonts.mono};
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 0.5rem;
  align-self: flex-start;

  &:hover {
    background-color: #38bdf8;
  }
`;

export const WelcomeScreen = ({ onStart }) => {
  return (
    <Container>
      <TerminalBox>
        <TopTag>
          <span>FINBOT QUANTITATIVE SUITE v2.4</span>
          <span>STATUS: ONLINE</span>
        </TopTag>

        <MainHeading>
          INSTITUTIONAL WEALTH MANAGEMENT <span>&amp; AI ENGINE</span>
        </MainHeading>

        <Description>
          Execute quantitative portfolio asset allocation, 1,000-path stochastic Monte Carlo wealth projections, risk-adjusted Sharpe ratio calculations, and real-time market data analysis.
        </Description>

        <PresetsGrid>
          <PresetCard onClick={() => onStart("I want to invest 500000 INR with medium risk in equity and debt funds")}>
            <div className="title">BALANCED GROWTH PORTFOLIO</div>
            <div className="sub">₹500,000 Capital • Medium Risk</div>
          </PresetCard>
          <PresetCard onClick={() => onStart("Build aggressive growth portfolio for 1000000 INR capital with high risk")}>
            <div className="title">AGGRESSIVE ALPHA PORTFOLIO</div>
            <div className="sub">₹1,000,000 Capital • High Risk</div>
          </PresetCard>
        </PresetsGrid>

        <LaunchBtn onClick={() => onStart()}>
          INITIALIZE TERMINAL WORKSPACE
        </LaunchBtn>
      </TerminalBox>
    </Container>
  );
};
