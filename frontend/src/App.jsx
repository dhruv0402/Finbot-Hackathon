import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from './theme';
import { MarketTickerTape } from './components/MarketTickerTape';
import { ChatInterface } from './components/ChatInterface';
import { PortfolioDisplay } from './components/PortfolioDisplay';
import { WealthSimulator } from './components/WealthSimulator';
import { RiskQuizModal } from './components/RiskQuizModal';
import { EfficientFrontierStressTest } from './components/EfficientFrontierStressTest';
import { TaxHarvestingWidget } from './components/TaxHarvestingWidget';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
  overflow: hidden;
`;

const MainHeader = styled.header`
  background-color: ${theme.colors.surface};
  border-bottom: 1px solid ${theme.colors.border};
  padding: 0.6rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .logo-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: ${theme.colors.textHeadline};
    font-family: ${theme.fonts.mono};
    letter-spacing: -0.03em;
  }

  .logo-tag {
    font-size: 0.65rem;
    padding: 0.15rem 0.4rem;
    background-color: #1e293b;
    color: ${theme.colors.primary};
    border: 1px solid ${theme.colors.borderLight};
    font-family: ${theme.fonts.mono};
  }
`;

const NavTabs = styled.nav`
  display: flex;
  gap: 0.4rem;
`;

const TabButton = styled.button`
  background-color: ${props => props.active ? '#0f172a' : 'transparent'};
  color: ${props => props.active ? theme.colors.primary : theme.colors.textMuted};
  border: 1px solid ${props => props.active ? theme.colors.primary : theme.colors.border};
  padding: 0.4rem 0.8rem;
  font-family: ${theme.fonts.mono};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: ${theme.colors.textHeadline};
    border-color: ${theme.colors.borderLight};
  }
`;

const ContentArea = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

// Default sample portfolio for Command Center tab if empty
const DEMO_PORTFOLIO = {
  risk_profile: "medium",
  projected_return_estimate: "10.8% p.a.",
  metrics: {
    sharpe_ratio: 1.52,
    expected_annual_return_pct: 10.8,
    annual_volatility_pct: 9.4,
    max_drawdown_pct: 10.4,
    var_95_pct: 6.2,
    beta_vs_market: 0.72
  },
  allocation: [
    {
      asset_class: "Equity Funds",
      amount: 200000,
      percentage: 0.40,
      recommendations: [{ name: "Nifty 50 Index Fund", details: "Core bluechip indexing", ticker: "NIFTY50" }]
    },
    {
      asset_class: "Debt Instruments",
      amount: 175000,
      percentage: 0.35,
      recommendations: [{ name: "Corporate Bond Fund AAA", details: "High stability debt yield", ticker: "AAA-DEBT" }]
    },
    {
      asset_class: "Direct Equity",
      amount: 75000,
      percentage: 0.15,
      recommendations: [{ name: "Reliance Industries / HDFC", details: "Large cap growth equity", ticker: "RELIANCE" }]
    },
    {
      asset_class: "Gold",
      amount: 50000,
      percentage: 0.10,
      recommendations: [{ name: "Sovereign Gold Bonds", details: "Hedge asset against inflation", ticker: "SGB" }]
    }
  ],
  rebalance_notes: [
    "Portfolio is currently in optimal target alignment.",
    "Next systematic rebalance date: October 2026."
  ]
};

function App() {
  const [activeTab, setActiveTab] = useState('welcome');
  const [activePortfolio, setActivePortfolio] = useState(DEMO_PORTFOLIO);

  const handleQuizComplete = (riskAppetite) => {
    setActivePortfolio(prev => ({
      ...prev,
      risk_profile: riskAppetite
    }));
    setActiveTab('portfolio');
  };

  const handleStartWelcome = (promptText) => {
    setActiveTab('chat');
  };

  return (
    <AppWrapper>
      <MarketTickerTape />

      <MainHeader>
        <LogoGroup>
          <span className="logo-title">FINBOT AI</span>
          <span className="logo-tag">QUANT DESK v3.0</span>
        </LogoGroup>

        <NavTabs>
          <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')}>
            [1] ASK FINBOT (AI)
          </TabButton>
          <TabButton active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')}>
            [2] PORTFOLIO PLAN
          </TabButton>
          <TabButton active={activeTab === 'simulator'} onClick={() => setActiveTab('simulator')}>
            [3] SIP WEALTH ENGINE
          </TabButton>
          <TabButton active={activeTab === 'mpt'} onClick={() => setActiveTab('mpt')}>
            [4] RISK &amp; FRONTIER
          </TabButton>
          <TabButton active={activeTab === 'tax'} onClick={() => setActiveTab('tax')}>
            [5] TAX &amp; SAVINGS GUIDE
          </TabButton>
          <TabButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')}>
            [6] RISK QUIZ
          </TabButton>
        </NavTabs>
      </MainHeader>

      <ContentArea>
        {activeTab === 'welcome' && <WelcomeScreen onStart={handleStartWelcome} />}
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'portfolio' && (
          <PortfolioDisplay text="PORTFOLIO COMMAND CENTER & RISK ANALYTICS" data={activePortfolio} />
        )}
        {activeTab === 'simulator' && <WealthSimulator />}
        {activeTab === 'mpt' && <EfficientFrontierStressTest portfolioData={activePortfolio} />}
        {activeTab === 'tax' && <TaxHarvestingWidget />}
        {activeTab === 'quiz' && <RiskQuizModal onComplete={handleQuizComplete} />}
      </ContentArea>
    </AppWrapper>
  );
}

export default App;
