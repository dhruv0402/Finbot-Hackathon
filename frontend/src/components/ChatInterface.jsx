import React, { useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { Bot, Terminal, Sparkles, Send, ShieldCheck, Zap } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { theme } from '../theme';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { PortfolioDisplay } from './PortfolioDisplay';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.card};
  overflow: hidden;
  box-shadow: ${theme.shadows.card};
`;

const TerminalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 1rem;
  background: ${theme.colors.surfaceHeader};
  border-bottom: 1px solid ${theme.colors.border};
  font-family: ${theme.fonts.mono};
  font-size: 0.72rem;

  .left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${theme.colors.textHeadline};
  }

  .meta-tag {
    font-size: 0.65rem;
    background: rgba(56, 189, 248, 0.1);
    color: ${theme.colors.primary};
    padding: 0.15rem 0.45rem;
    border: 1px solid rgba(56, 189, 248, 0.25);
    border-radius: ${theme.radii.subtle};
  }
`;

const MessagesBox = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  background: ${theme.colors.backgroundSubtle};
`;

const UserBubble = styled.div`
  align-self: flex-end;
  max-width: 78%;
  background: linear-gradient(135deg, ${theme.colors.surfaceElevated} 0%, ${theme.colors.userBubble} 100%);
  color: ${theme.colors.textHeadline};
  border: 1px solid ${theme.colors.borderLight};
  border-left: 3px solid ${theme.colors.primary};
  border-radius: ${theme.radii.card};
  padding: 0.75rem 1rem;
  font-family: ${theme.fonts.primary};
  font-size: 0.85rem;
  line-height: 1.5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

  .prefix {
    font-family: ${theme.fonts.mono};
    color: ${theme.colors.primary};
    font-size: 0.72rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
`;

const BotBubble = styled.div`
  align-self: flex-start;
  max-width: 85%;
  background: ${theme.colors.surface};
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.card};
  padding: 0.95rem 1.15rem;
  font-family: ${theme.fonts.primary};
  font-size: 0.85rem;
  line-height: 1.6;
  white-space: pre-wrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);

  .bot-header {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-family: ${theme.fonts.mono};
    font-size: 0.7rem;
    color: ${theme.colors.primary};
    margin-bottom: 0.45rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
`;

const PromptBar = styled.div`
  display: flex;
  gap: 0.45rem;
  padding: 0.55rem 1rem;
  background: ${theme.colors.surface};
  border-top: 1px solid ${theme.colors.border};
  overflow-x: auto;
  align-items: center;

  .label {
    font-family: ${theme.fonts.mono};
    font-size: 0.68rem;
    color: ${theme.colors.textDim};
    text-transform: uppercase;
    white-space: nowrap;
    margin-right: 0.25rem;
  }
`;

const PresetPill = styled.button`
  background: ${theme.colors.backgroundSubtle};
  color: ${theme.colors.textMuted};
  border: 1px solid ${theme.colors.border};
  padding: 0.3rem 0.65rem;
  font-family: ${theme.fonts.mono};
  font-size: 0.72rem;
  border-radius: ${theme.radii.subtle};
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.15s ease;

  &:hover {
    color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
    background: ${theme.colors.surfaceElevated};
  }
`;

export const ChatInterface = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const presets = [
    { label: "Analyst Roadmap", prompt: "roadmap to become a financial analhyst like you" },
    { label: "Tax-Loss Harvest", prompt: "Calculate tax harvesting for TCS with ₹1.2L capital gains" },
    { label: "MPT Optimization", prompt: "Optimize MPT portfolio for RELIANCE, TCS, INFY with 6.5% risk-free rate" },
    { label: "₹10,000 SIP", prompt: "Build ₹10,000 monthly SIP allocation with 70/30 equity-debt mix" },
    { label: "Sharpe Ratio", prompt: "Explain Sharpe Ratio and Sortino Ratio differences for Indian funds" }
  ];

  return (
    <Container>
      <TerminalHeader>
        <div className="left">
          <Terminal size={14} color={theme.colors.primary} />
          <span>QUANT DESK CONVERSATIONAL ORCHESTRATION</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="meta-tag">GEMINI 3.5 FLASH ROUTER</span>
          <span className="meta-tag">SEBI COMPLIANT</span>
        </div>
      </TerminalHeader>

      <MessagesBox ref={scrollRef}>
        {messages.map((msg, idx) => {
          if (msg.type === 'portfolio' && msg.data) {
            return <PortfolioDisplay key={idx} text="RECOMMENDED ASSET ALLOCATION PLAN" data={msg.data} />;
          }
          if (msg.from === 'user') {
            return (
              <UserBubble key={idx}>
                <div className="prefix">&gt; INSTITUTIONAL QUERY</div>
                <div>{msg.text}</div>
              </UserBubble>
            );
          }
          return (
            <BotBubble key={idx}>
              <div className="bot-header">
                <Bot size={13} />
                <span>FinBot AI Quantitative Response</span>
              </div>
              <div>{msg.text}</div>
            </BotBubble>
          );
        })}
        {isLoading && <TypingIndicator />}
      </MessagesBox>

      <PromptBar>
        <span className="label">Suggested Inquiries:</span>
        {presets.map((p, i) => (
          <PresetPill key={i} onClick={() => sendMessage(p.prompt)}>
            <Sparkles size={11} color={theme.colors.primary} />
            {p.label}
          </PresetPill>
        ))}
      </PromptBar>

      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </Container>
  );
};
