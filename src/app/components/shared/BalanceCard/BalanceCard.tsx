import React from 'react';
import { EyeOutlined, EyeInvisibleOutlined, CaretDownOutlined } from '@ant-design/icons';
import styles from './BalanceCard.module.css';

interface BalanceCardProps {
  title: string;
  amount: string;
  currency: string;
  profit?: {
    amount: string;
    percentage: string;
  };
  isHidden?: boolean;
  onToggleVisibility?: () => void;
  actions: Array<{
    label: string;
    isPrimary?: boolean;
    onClick: () => void;
  }>;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  amount,
  currency,
  profit,
  isHidden = false,
  onToggleVisibility,
  actions,
}) => {
  return (
    <div className={styles.balanceCard}>
      <div className={styles.balanceHeader}>
        <div className={styles.titleWrapper}>
          {title}
          {onToggleVisibility && (
            <button 
              className={styles.visibilityToggle}
              onClick={onToggleVisibility}
            >
              {isHidden ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </button>
          )}
        </div>
        
        <div className={styles.balanceWrapper}>
          <div className={styles.amountSection}>
            <span className={`${styles.amount} ${isHidden ? styles.hidden : ''}`}>
              {amount}
            </span>
            <button className={styles.currencyButton}>
              {currency} <CaretDownOutlined />
            </button>
          </div>
          
          {profit && (
            <div className={styles.profitText}>
              PnL hôm nay {profit.amount} ({profit.percentage})
            </div>
          )}
        </div>
      </div>

      <div className={styles.actionButtons}>
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${styles.actionBtn} ${action.isPrimary ? styles.primary : ''}`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BalanceCard;