import React, { useState } from 'react';
import styled from '@emotion/styled';
import { 
  Bot, PieChart, TrendingUp, ShieldCheck, Receipt, FileSearch, 
  HelpCircle, Activity, Sparkles, Terminal, ArrowUpRight, Cpu 
} from 'lucide-react';
import { theme } from './theme';
import { MarketTickerTape } from './components/MarketTickerTape';
import { ChatInterface } from './components/ChatInterface';
import { PortfolioDisplay } from './components/PortfolioDisplay';
import { WealthSimulator } from './components/WealthSimulator';
import { RiskQuizModal } from './components/RiskQuizModal';
import { EfficientFrontierStressTest } from './components/EfficientFrontierStressTest';
import { TaxHarvestingWidget } from './components/TaxHarvestingWidget';
import { MarketProbeAuditWidget } from './components/MarketProbeAuditWidget';
import { WelcomeScreen } from './components/WelcomeScreen';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
  overflow: hidden;
  font-family: ${theme.fonts.primary};
`;

const MainHeader = styled.header`
  background: linear-gradient(180deg, ${theme.colors.surfaceElevated} 0%, ${theme.colors.surface} 100%);
  border-bottom: 1px solid ${theme.colors.border};
  padding: 0.55rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${theme.shadows.terminal};
  z-index: 10;
`;

const LogoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  cursor: pointer;

  .logo-icon-wrap {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%);
    border: 1px solid rgba(56, 189, 248, 0.4);
    border-radius: ${theme.radii.card};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.primary};
  }

  .logo-text-block {
    display: flex;
    flex-direction: column;
  }

  .logo-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: ${theme.colors.textHeadline};
    font-family: ${theme.fonts.mono};
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .logo-subtitle {
    font-size: 0.65rem;
    color: ${theme.colors.textDim};
    font-family: ${theme.fonts.mono};
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
`;

const NavTabs = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: ${theme.colors.backgroundSubtle};
  padding: 0.2rem 0.25rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.card};
`;

const TabButton = styled.button`
  background: ${props => props.active ? theme.colors.surfaceElevated : 'transparent'};
  color: ${props => props.active ? theme.colors.primary : theme.colors.textMuted};
  border: 1px solid ${props => props.active ? theme.colors.borderLight : 'transparent'};
  padding: 0.35rem 0.75rem;
  font-family: ${theme.fonts.mono};
  font-size: 0.73rem;
  font-weight: ${props => props.active ? '600' : '500'};
  border-radius: ${theme.radii.subtle};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  transition: all 0.15s ease;

  &:hover {
    color: ${theme.colors.textHeadline};
    background: ${props => props.active ? theme.colors.surfaceElevated : 'rgba(255, 255, 255, 0.03)'};
  }

  .tab-icon {
    opacity: ${props => props.active ? 1 : 0.7};
  }
`;

const StatusPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${theme.fonts.mono};
  font-size: 0.7rem;
  color: ${theme.colors.textDim};
  padding: 0.25rem 0.65rem;
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: ${theme.radii.card};

  .pulse-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${theme.colors.accent};
    box-shadow: 0 0 8px ${theme.colors.accent};
  }
`;

const ContentArea = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 0.85rem 1rem;
  background: ${theme.colors.background};
`;

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

  const handleStartWelcome = () => {
    setActiveTab('chat');
  };

  return (
    <AppWrapper>
      <MarketTickerTape />

      <MainHeader>
        <LogoGroup onClick={() => setActiveTab('welcome')}>
          <div className="logo-icon-wrap">
            <Cpu size={18} />
          </div>
          <div className="logo-text-block">
            <span className="logo-title">FINBOT AI</span>
            <span className="logo-subtitle">INSTITUTIONAL QUANT DESK</span>
          </div>
        </LogoGroup>

        <NavTabs>
          <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')}>
            <Bot size={13} className="tab-icon" /> Ask FinBot
          </TabButton>
          <TabButton active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')}>
            <PieChart size={13} className="tab-icon" /> Portfolio Plan
          </TabButton>
          <TabButton active={activeTab === 'simulator'} onClick={() => setActiveTab('simulator')}>
            <TrendingUp size={13} className="tab-icon" /> SIP Engine
          </TabButton>
          <TabButton active={activeTab === 'mpt'} onClick={() => setActiveTab('mpt')}>
            <Activity size={13} className="tab-icon" /> Frontier &amp; Risk
          </TabButton>
          <TabButton active={activeTab === 'tax'} onClick={() => setActiveTab('tax')}>
            <Receipt size={13} className="tab-icon" /> Tax Harvest
          </TabButton>
          <TabButton active={activeTab === 'audit'} onClick={() => setActiveTab('audit')}>
            <FileSearch size={13} className="tab-icon" /> Stock Tip Auditor
          </TabButton>
          <TabButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')}>
            <HelpCircle size={13} className="tab-icon" /> Risk Quiz
          </TabButton>
        </NavTabs>

        <StatusPill>
          <div className="pulse-dot" />
          <span>NSE / BSE FEED • GEMINI 3.5 ROUTER</span>
        </StatusPill>
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
        {activeTab === 'audit' && <MarketProbeAuditWidget />}
        {activeTab === 'quiz' && <RiskQuizModal onComplete={handleQuizComplete} />}
      </ContentArea>
    </AppWrapper>
  );
}

export default App;
