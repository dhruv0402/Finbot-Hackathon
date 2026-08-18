import React, { useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { theme } from '../theme';
import { getApiBase } from '../services/apiConfig';

const Container = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${theme.colors.textHeadline};
  font-family: ${theme.fonts.mono};
  border-bottom: 1px solid ${theme.colors.border};
  padding-bottom: 0.5rem;
`;

const QuestionBox = styled.div`
  background-color: #0f172a;
  border: 1px solid ${theme.colors.border};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  .q-num {
    font-size: 0.75rem;
    color: ${theme.colors.primary};
    font-family: ${theme.fonts.mono};
  }

  .q-text {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${theme.colors.textHeadline};
  }
`;

const OptionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OptionButton = styled.button`
  background-color: ${props => props.selected ? '#1e293b' : '#0b0f17'};
  color: ${props => props.selected ? theme.colors.primary : theme.colors.text};
  border: 1px solid ${props => props.selected ? theme.colors.primary : theme.colors.border};
  padding: 0.6rem 0.8rem;
  font-family: ${theme.fonts.primary};
  font-size: 0.85rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.6rem;

  &:hover {
    border-color: ${theme.colors.borderLight};
  }

  .opt-key {
    font-family: ${theme.fonts.mono};
    font-size: 0.75rem;
    padding: 0.1rem 0.4rem;
    background-color: #1e293b;
    color: ${theme.colors.textMuted};
  }
`;

const ResultCard = styled.div`
  background-color: #0f172a;
  border: 1px solid ${theme.colors.accent};
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .res-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: ${theme.colors.accent};
    font-family: ${theme.fonts.mono};
  }

  .res-desc {
    font-size: 0.85rem;
    color: ${theme.colors.textMuted};
    line-height: 1.4;
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PrimaryBtn = styled.button`
  background-color: ${theme.colors.primary};
  color: #000000;
  border: none;
  padding: 0.6rem 1.2rem;
  font-family: ${theme.fonts.mono};
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: "What is your primary investment objective for this capital?",
    options: [
      { text: "Preserve capital and generate steady interest income", score: 1 },
      { text: "Maintain purchasing power while generating moderate growth", score: 3 },
      { text: "Maximize long-term aggressive capital growth", score: 5 }
    ]
  },
  {
    id: "q2",
    question: "If your portfolio dropped 20% during a market panic, how would you respond?",
    options: [
      { text: "Liquidate remaining assets into cash/gold immediately", score: 1 },
      { text: "Hold existing positions and wait for market recovery", score: 3 },
      { text: "Capitalize on discount prices and purchase additional shares", score: 5 }
    ]
  },
  {
    id: "q3",
    question: "What is your expected investment timeframe before needing cash withdrawals?",
    options: [
      { text: "Less than 2 years (short-term liquidity focus)", score: 1 },
      { text: "3 to 7 years (medium-term goals)", score: 3 },
      { text: "8+ years (long-term compounding horizon)", score: 5 }
    ]
  },
  {
    id: "q4",
    question: "What percentage of your overall monthly income do you save and invest?",
    options: [
      { text: "Less than 10%", score: 1 },
      { text: "10% to 30%", score: 3 },
      { text: "Greater than 30%", score: 5 }
    ]
  },
  {
    id: "q5",
    question: "How familiar are you with quantitative financial assets (equities, bonds, derivatives)?",
    options: [
      { text: "Beginner: Prefer fixed deposits and government securities", score: 1 },
      { text: "Intermediate: Invest in index funds and mutual funds", score: 3 },
      { text: "Advanced: Active stock, ETF, and alternative asset trader", score: 5 }
    ]
  }
];

export const RiskQuizModal = ({ onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleSelect = (qId, score) => {
    setAnswers(prev => ({ ...prev, [qId]: score }));
  };

  const calculateRisk = async () => {
    try {
      const res = await axios.post(`${getApiBase()}/api/risk-quiz`, answers);
      setResult(res.data);
      if (onComplete) onComplete(res.data.risk_appetite);
    } catch (e) {
      const score = Object.values(answers).reduce((a, b) => a + b, 0);
      let appetite = "medium";
      if (score <= 10) appetite = "low";
      if (score >= 19) appetite = "high";
      const fallbackRes = {
        score,
        risk_appetite: appetite,
        description: `Score: ${score}/25. Classified as ${appetite.toUpperCase()} Risk Investor.`
      };
      setResult(fallbackRes);
      if (onComplete) onComplete(appetite);
    }
  };

  const isComplete = Object.keys(answers).length === QUIZ_QUESTIONS.length;

  return (
    <Container>
      <Title>QUANTITATIVE INVESTOR RISK PROFILE EVALUATOR</Title>

      {QUIZ_QUESTIONS.map((q, idx) => (
        <QuestionBox key={q.id}>
          <div className="q-num">QUESTION 0{idx + 1} OF 05</div>
          <div className="q-text">{q.question}</div>
          <OptionsGrid>
            {q.options.map((opt, oIdx) => (
              <OptionButton
                key={oIdx}
                selected={answers[q.id] === opt.score}
                onClick={() => handleSelect(q.id, opt.score)}
              >
                <span className="opt-key">[{String.fromCharCode(65 + oIdx)}]</span>
                {opt.text}
              </OptionButton>
            ))}
          </OptionsGrid>
        </QuestionBox>
      ))}

      {result && (
        <ResultCard>
          <div className="res-title">PROFILE ASSIGNED: {result.risk_appetite.toUpperCase()} RISK</div>
          <div className="res-desc">{result.description}</div>
        </ResultCard>
      )}

      <ActionRow>
        <span style={{ fontSize: '0.75rem', color: theme.colors.textMuted, fontFamily: theme.fonts.mono }}>
          {Object.keys(answers).length}/5 QUESTIONS COMPLETED
        </span>
        <PrimaryBtn disabled={!isComplete} onClick={calculateRisk}>
          EVALUATE PROFILE
        </PrimaryBtn>
      </ActionRow>
    </Container>
  );
};
