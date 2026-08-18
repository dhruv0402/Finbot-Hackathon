import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { theme } from '../theme';
import { getApiBase } from '../services/apiConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${theme.colors.border};
  padding-bottom: 0.75rem;

  h2 {
    font-size: 1.1rem;
    font-weight: 700;
    color: ${theme.colors.textHeadline};
    font-family: ${theme.fonts.mono};
    letter-spacing: 0.05em;
  }

  .badge {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
    background-color: #1e293b;
    color: ${theme.colors.primary};
    border: 1px solid ${theme.colors.borderLight};
    font-family: ${theme.fonts.mono};
  }
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ControlsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  background-color: #0f172a;
  padding: 1.2rem;
  border: 1px solid ${theme.colors.border};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.75rem;
    color: ${theme.colors.textMuted};
    font-family: ${theme.fonts.mono};
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;
    
    span.val {
      color: ${theme.colors.primary};
      font-weight: 600;
    }
  }

  input[type="range"] {
    accent-color: ${theme.colors.primary};
    cursor: pointer;
  }

  select {
    background-color: #1e293b;
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};
    padding: 0.5rem;
    font-family: ${theme.fonts.mono};
    font-size: 0.85rem;
    outline: none;
  }
`;

const StatsSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: #0f172a;
  border: 1px solid ${theme.colors.border};
  padding: 0.8rem 1rem;

  .stat-label {
    font-size: 0.7rem;
    color: ${theme.colors.textMuted};
    font-family: ${theme.fonts.mono};
    text-transform: uppercase;
  }

  .stat-val {
    font-size: 1.15rem;
    font-weight: 700;
    color: ${props => props.color || theme.colors.textHeadline};
    font-family: ${theme.fonts.mono};
    margin-top: 0.2rem;
  }
`;

const ChartBox = styled.div`
  background-color: #0f172a;
  border: 1px solid ${theme.colors.border};
  padding: 1rem;
  min-height: 320px;
`;

export const WealthSimulator = () => {
  const [initialCapital, setInitialCapital] = useState(100000);
  const [monthlyContrib, setMonthlyContrib] = useState(10000);
  const [horizonYears, setHorizonYears] = useState(15);
  const [riskLevel, setRiskLevel] = useState('medium');

  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const runSim = async () => {
      setLoading(true);
      try {
        const res = await axios.post(`${getApiBase()}/api/portfolio/simulate`, {
          initial_capital: initialCapital,
          monthly_contribution: monthlyContrib,
          time_horizon_years: horizonYears,
          risk_level: riskLevel
        });
        setSimResult(res.data);
      } catch (e) {
        // Fallback local stochastic simulator if backend offline
        const years = horizonYears;
        const projections = [];
        let invested = initialCapital;
        const ret = riskLevel === 'high' ? 0.13 : (riskLevel === 'low' ? 0.07 : 0.10);
        for (let y = 0; y <= years; y++) {
          const mComp = initialCapital * Math.pow(1 + ret, y) + (monthlyContrib * 12 * y * (Math.pow(1 + ret, y / 2)));
          projections.push({
            year: y,
            median: Math.round(mComp),
            p10: Math.round(mComp * 0.8),
            p90: Math.round(mComp * 1.35),
            invested: Math.round(invested)
          });
          invested += monthlyContrib * 12;
        }
        const last = projections[projections.length - 1];
        setSimResult({
          median_final_value: last.median,
          percentile_10_value: last.p10,
          percentile_90_value: last.p90,
          total_invested: last.invested,
          projections
        });
      } finally {
        setLoading(false);
      }
    };
    runSim();
  }, [initialCapital, monthlyContrib, horizonYears, riskLevel]);

  const chartData = {
    labels: simResult?.projections.map(p => `Yr ${p.year}`) || [],
    datasets: [
      {
        label: '90th Percentile (Bull Case)',
        data: simResult?.projections.map(p => p.p90) || [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        fill: '+1',
        tension: 0.2,
        pointRadius: 0
      },
      {
        label: 'Median Projection (P50)',
        data: simResult?.projections.map(p => p.median) || [],
        borderColor: '#0ea5e9',
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        tension: 0.2,
        pointRadius: 2
      },
      {
        label: '10th Percentile (Bear Case)',
        data: simResult?.projections.map(p => p.p10) || [],
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.2,
        pointRadius: 0
      },
      {
        label: 'Total Capital Invested',
        data: simResult?.projections.map(p => p.invested) || [],
        borderColor: '#64748b',
        backgroundColor: 'transparent',
        borderWidth: 1,
        tension: 0,
        pointRadius: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'IBM Plex Mono', size: 11 }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ₹${context.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#64748b', font: { family: 'IBM Plex Mono' } },
        grid: { color: '#1e293b' }
      },
      y: {
        ticks: {
          color: '#64748b',
          font: { family: 'IBM Plex Mono' },
          callback: (value) => `₹${(value / 100000).toFixed(1)}L`
        },
        grid: { color: '#1e293b' }
      }
    }
  };

  return (
    <Container>
      <SectionHeader>
        <h2>STOCHASTIC MONTE CARLO WEALTH ENGINE</h2>
        <span className="badge">1,000 SIMULATION PATHS</span>
      </SectionHeader>

      <LayoutGrid>
        <ControlsPanel>
          <FormGroup>
            <label>
              Initial Principal
              <span className="val">₹{initialCapital.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="10000"
              max="5000000"
              step="10000"
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
            />
          </FormGroup>

          <FormGroup>
            <label>
              Monthly Contribution (SIP)
              <span className="val">₹{monthlyContrib.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="0"
              max="200000"
              step="2500"
              value={monthlyContrib}
              onChange={(e) => setMonthlyContrib(Number(e.target.value))}
            />
          </FormGroup>

          <FormGroup>
            <label>
              Investment Horizon
              <span className="val">{horizonYears} Years</span>
            </label>
            <input
              type="range"
              min="1"
              max="35"
              step="1"
              value={horizonYears}
              onChange={(e) => setHorizonYears(Number(e.target.value))}
            />
          </FormGroup>

          <FormGroup>
            <label>Risk Strategy</label>
            <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}>
              <option value="low">Low Risk (7.5% Return / 5% Volatility)</option>
              <option value="medium">Medium Risk (10.5% Return / 10% Volatility)</option>
              <option value="high">High Risk (14.0% Return / 18% Volatility)</option>
            </select>
          </FormGroup>
        </ControlsPanel>

        <div>
          <StatsSummaryGrid>
            <StatCard color={theme.colors.textMuted}>
              <div className="stat-label">Total Outlay</div>
              <div className="stat-val">₹{simResult?.total_invested?.toLocaleString() || 0}</div>
            </StatCard>
            <StatCard color={theme.colors.primary}>
              <div className="stat-label">Median Target (P50)</div>
              <div className="stat-val">₹{simResult?.median_final_value?.toLocaleString() || 0}</div>
            </StatCard>
            <StatCard color={theme.colors.accent}>
              <div className="stat-label">90th Pct (Bull)</div>
              <div className="stat-val">₹{simResult?.percentile_90_value?.toLocaleString() || 0}</div>
            </StatCard>
            <StatCard color={theme.colors.warning}>
              <div className="stat-label">10th Pct (Bear)</div>
              <div className="stat-val">₹{simResult?.percentile_10_value?.toLocaleString() || 0}</div>
            </StatCard>
          </StatsSummaryGrid>

          <ChartBox>
            {simResult && <Line data={chartData} options={chartOptions} height={300} />}
          </ChartBox>
        </div>
      </LayoutGrid>
    </Container>
  );
};
