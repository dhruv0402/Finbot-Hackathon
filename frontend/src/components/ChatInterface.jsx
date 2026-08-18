import React, { useRef, useEffect } from 'react';
import styled from '@emotion/styled';
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
  background-color: ${theme.colors.background};
`;

const MessagesBox = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UserBubble = styled.div`
  align-self: flex-end;
  max-width: 75%;
  background-color: #0f172a;
  color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.radii.subtle};
  padding: 0.75rem 1rem;
  font-family: ${theme.fonts.mono};
  font-size: 0.85rem;
  line-height: 1.5;
`;

const BotBubble = styled.div`
  align-self: flex-start;
  max-width: 80%;
  background-color: ${theme.colors.surface};
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.subtle};
  padding: 0.85rem 1.1rem;
  font-family: ${theme.fonts.primary};
  font-size: 0.85rem;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const PromptBar = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background-color: #070a11;
  border-top: 1px solid ${theme.colors.border};
  overflow-x: auto;
`;

const PresetPill = styled.button`
  background-color: #111827;
  color: ${theme.colors.textMuted};
  border: 1px solid ${theme.colors.border};
  padding: 0.35rem 0.7rem;
  font-family: ${theme.fonts.mono};
  font-size: 0.75rem;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
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
    "Start ₹5,000 monthly SIP",
    "Build ₹1 Lakh medium risk portfolio",
    "Nifty 50 vs Bank FD comparison",
    "Explain ELSS Tax Savings (Sec 80C)",
    "What is Sharpe Ratio?"
  ];

  return (
    <Container>
      <MessagesBox ref={scrollRef}>
        {messages.map((msg, idx) => {
          if (msg.type === 'portfolio' && msg.data) {
            return <PortfolioDisplay key={idx} text="RECOMMENDED ASSET ALLOCATION PLAN" data={msg.data} />;
          }
          if (msg.from === 'user') {
            return <UserBubble key={idx}>PROMPT &gt; {msg.text}</UserBubble>;
          }
          return <BotBubble key={idx}>{msg.text}</BotBubble>;
        })}
        {isLoading && <TypingIndicator />}
      </MessagesBox>

      <PromptBar>
        {presets.map((p, i) => (
          <PresetPill key={i} onClick={() => sendMessage(p)}>
            + {p}
          </PresetPill>
        ))}
      </PromptBar>

      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </Container>
  );
};
