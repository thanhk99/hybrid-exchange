import React, { useState } from 'react';
import { ChartPeriod } from '../../accountOverviewMockData';
import styles from './BalanceChart.module.css';

interface ChartDataPoint {
  time: string;
  value: number;
}

interface BalanceChartProps {
  data: ChartDataPoint[];
  onPeriodChange?: (period: ChartPeriod) => void;
}

const BalanceChart: React.FC<BalanceChartProps> = ({
  data,
  onPeriodChange
}) => {
  const [activePeriod, setActivePeriod] = useState<ChartPeriod>(ChartPeriod.ONE_DAY);

  const periods = [
    { key: ChartPeriod.ONE_DAY, label: '1 Ngày' },
    { key: ChartPeriod.ONE_WEEK, label: '1 Tuần' },
    { key: ChartPeriod.ONE_MONTH, label: '1 Tháng' },
    { key: ChartPeriod.SIX_MONTHS, label: '6 Tháng' }
  ];

  const handlePeriodClick = (period: ChartPeriod) => {
    setActivePeriod(period);
    onPeriodChange?.(period);
  };

  // Create SVG path for the line chart
  const createPath = (points: ChartDataPoint[]) => {
    if (points.length === 0) return '';
    
    const width = 800;
    const height = 200;
    const padding = 40;
    
    const maxValue = Math.max(...points.map(p => p.value));
    const minValue = Math.min(...points.map(p => p.value));
    const valueRange = maxValue - minValue || 1;
    
    const pathData = points.map((point, index) => {
      const x = padding + (index / (points.length - 1)) * (width - 2 * padding);
      const y = padding + (1 - (point.value - minValue) / valueRange) * (height - 2 * padding);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return pathData;
  };

  const createAreaPath = (points: ChartDataPoint[]) => {
    if (points.length === 0) return '';
    
    const linePath = createPath(points);
    const width = 800;
    const height = 200;
    const padding = 40;
    
    const lastX = padding + (width - 2 * padding);
    const bottomY = height - padding;
    const firstX = padding;
    
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.periodButtons}>
          {periods.map(period => (
            <button
              key={period.key}
              onClick={() => handlePeriodClick(period.key)}
              className={`${styles.periodButton} ${activePeriod === period.key ? styles.active : ''}`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.chartContainer}>
        <svg 
          viewBox="0 0 800 200" 
          className={styles.chart}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-chart-line)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-chart-line)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <g className={styles.gridLines}>
            {[1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1="40"
                y1={40 + (i * 40)}
                x2="760"
                y2={40 + (i * 40)}
                stroke="var(--color-border)"
                strokeWidth="0.5"
              />
            ))}
          </g>
          
          {/* Area fill */}
          <path
            d={createAreaPath(data)}
            fill="url(#chartGradient)"
            className={styles.chartArea}
          />
          
          {/* Line */}
          <path
            d={createPath(data)}
            fill="none"
            stroke="var(--color-chart-line)"
            strokeWidth="2"
            className={styles.chartLine}
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const width = 800;
            const height = 200;
            const padding = 40;
            const maxValue = Math.max(...data.map(p => p.value));
            const minValue = Math.min(...data.map(p => p.value));
            const valueRange = maxValue - minValue || 1;
            
            const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
            const y = padding + (1 - (point.value - minValue) / valueRange) * (height - 2 * padding);
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="var(--color-chart-line)"
                className={styles.chartPoint}
              />
            );
          })}
        </svg>
        
        <div className={styles.timeLabels}>
          {data.map((point, index) => (
            <span key={index} className={styles.timeLabel}>
              {point.time}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.viewAssetsButton}>
          Xem tài sản của tôi →
        </button>
      </div>
    </div>
  );
};

export default BalanceChart;