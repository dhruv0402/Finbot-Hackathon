import React, { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../theme';

const InputForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.25rem;
  border-top: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.surface};
`;

const StyledInput = styled.input`
  flex: 1;
  font-size: 0.85rem;
  font-family: ${theme.fonts.mono};
  padding: 0.7rem 1rem;
  border-radius: ${theme.radii.subtle};
  border: 1px solid ${theme.colors.border};
  background-color: #0b0f17;
  color: ${theme.colors.text};
  outline: none;
  
  &::placeholder {
    color: ${theme.colors.textDim};
  }

  &:focus {
    border-color: ${theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.2rem;
  border-radius: ${theme.radii.subtle};
  border: 1px solid ${theme.colors.primary};
  background-color: ${theme.colors.primary};
  color: #000000;
  font-family: ${theme.fonts.mono};
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #38bdf8;
  }
`;

export const ChatInput = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <InputForm onSubmit={handleSubmit}>
      <StyledInput
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isLoading ? "SYSTEM COMPUTING RESPONSE..." : "ENTER ADVISORY PROMPT (E.G., 'ALLOCATE 500000 INR HIGH RISK')..."}
        disabled={isLoading}
      />
      <SendButton type="submit" disabled={isLoading}>
        {isLoading ? "PROCESSING..." : "TRANSMIT"}
      </SendButton>
    </InputForm>
  );
};
