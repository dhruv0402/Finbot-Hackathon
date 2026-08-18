import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../theme';

const Bubble = styled.div`
  padding: 0.6rem 1rem;
  border-radius: ${theme.radii.subtle};
  max-width: 60%;
  font-family: ${theme.fonts.mono};
  font-size: 0.75rem;
  color: ${theme.colors.primary};
  align-self: flex-start;
  background-color: #0f172a;
  border: 1px solid ${theme.colors.border};
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const TypingIndicator = () => {
  return (
    <Bubble>
      <span>[QUANTITATIVE ENGINE ANALYZING PORTFOLIO DATA...]</span>
    </Bubble>
  );
};
