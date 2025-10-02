import React from 'react';
import styles from './BalanceChart.module.css';

interface ChartDataPoint {
  time: string;
  value: number;
}

interface BalanceChartProps {
  data: ChartDataPoint[];
  height?: number;
}

const BalanceChart: React.FC<BalanceChartProps> = ({ data, height = 60 }) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyChart} style={{ height }}>
        <div className={styles.emptyLine}></div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((point.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={styles.chartContainer} style={{ height }}>
      <svg
        className={styles.chart}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polyline
          className={styles.chartLine}
          points={points}
          fill="none"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default BalanceChart;