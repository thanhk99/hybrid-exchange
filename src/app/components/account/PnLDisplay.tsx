import React from 'react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface PnLDisplayProps {
  pnlToday: number | undefined | null;
  pnlPercentage: number | undefined | null;
  className?: string;
}

const PnLDisplay: React.FC<PnLDisplayProps> = ({ 
  pnlToday, 
  pnlPercentage, 
  className = '' 
}) => {
  const isPositive = (pnlToday ?? 0) >= 0;
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-gray-500">PnL hôm nay</span>
      <span className={`text-xs font-medium ${colorClass}`}>
        {isPositive ? '+' : '-'}${formatCurrency(Math.abs(pnlToday ?? 0))} ({formatPercentage(pnlPercentage)})
      </span>
    </div>
  );
};

export default PnLDisplay;