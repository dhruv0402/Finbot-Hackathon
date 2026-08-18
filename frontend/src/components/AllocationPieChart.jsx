import React from 'react';
import styled from '@emotion/styled';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { theme } from '../theme';

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 280px;
  margin: 1rem auto;
`;

const CenterStat = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  
  .label {
    font-size: 0.75rem;
    color: ${theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: ${theme.fonts.mono};
  }
  
  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${theme.colors.accent};
    font-family: ${theme.fonts.mono};
  }
`;

export const AllocationPieChart = ({ allocationData = [], projectedReturn = "10.8%" }) => {
  const labels = allocationData.map(item => item.asset_class || item.type || 'Asset');
  const values = allocationData.map(item => {
    if (typeof item.percentage === 'number') {
      return item.percentage > 1 ? item.percentage : item.percentage * 100;
    }
    return item.amount || 0;
  });

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          '#0ea5e9',
          '#10b981',
          '#f59e0b',
          '#6366f1',
          '#64748b'
        ],
        borderColor: theme.colors.surface,
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: (context) => ` ${context.label}: ${context.raw.toFixed(1)}%`
        }
      },
    },
    animation: { duration: 600 },
  };

  return (
    <ChartWrapper>
      <CenterStat>
        <div className="label">TARGET RETURN</div>
        <div className="value">{projectedReturn}</div>
      </CenterStat>
      <Doughnut data={chartData} options={chartOptions} />
    </ChartWrapper>
  );
};
