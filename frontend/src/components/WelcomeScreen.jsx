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
  padding: 2rem;
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

  @media (max-width: 600px) {
    padding: 1.25rem;
  }
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
  font-size: 1.7rem;
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

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PresetCard = styled.div`
  background-color: #0b0f17;
  border: 1px solid ${theme.colors.border};
  padding: 0.85rem;
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
          <span>FINBOT AI | INDIAN WEALTH ADVISOR</span>
          <span>MARKETS: NSE / BSE LIVE</span>
        </TopTag>

        <MainHeading>
          START INVESTING IN INDIA <span>WITH AI PRECISION</span>
        </MainHeading>

        <Description>
          Whether you want to start your first ₹5,000/month SIP, build a ₹1 Lakh balanced portfolio, or learn how Nifty 50 outperforms Bank FDs — FinBot guides you step-by-step.
        </Description>

        <PresetsGrid>
          <PresetCard onClick={() => onStart("I want to start investing 5000 monthly SIP with medium risk")}>
            <div className="title">START ₹5,000 MONTHLY SIP</div>
            <div className="sub">Automated Mutual Fund Allocation</div>
          </PresetCard>

          <PresetCard onClick={() => onStart("Build my 100000 INR portfolio with medium risk")}>
            <div className="title">BUILD ₹1 LAKH PORTFOLIO</div>
            <div className="sub">Equities, Debt &amp; Sovereign Gold</div>
          </PresetCard>

          <PresetCard onClick={() => onStart("Nifty 50 Index Fund vs Bank Fixed Deposit")}>
            <div className="title">NIFTY 50 VS BANK FD</div>
            <div className="sub">Compare Returns &amp; Risk Profiles</div>
          </PresetCard>

          <PresetCard onClick={() => onStart("How does ELSS save income tax under Section 80C?")}>
            <div className="title">TAX SAVING (SECTION 80C)</div>
            <div className="sub">Save up to ₹46,800/yr in Tax</div>
          </PresetCard>
        </PresetsGrid>

        <LaunchBtn onClick={() => onStart()}>
          OPEN FINBOT ADVISORY DESK
        </LaunchBtn>
      </TerminalBox>
    </Container>
  );
};
