'use client';

import { 
  SwapOutlined, 
  ThunderboltOutlined, 
  RiseOutlined,
} from '@ant-design/icons';
import styles from './TrandingFeature.module.css';
import { SiTradingview } from 'react-icons/si';

const TradingFeatures = () => {
  const quickActions = [
    { 
      icon: <SwapOutlined />, 
      label: 'P2P', 
      description: 'Giao dịch trực tiếp , nhanh chóng',
      href: '/p2p',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    { 
      icon: <ThunderboltOutlined />, 
      label: 'Spot', 
      description: 'Giao dịch nhanh chóng , khớp lệnh tức thì ',
      href: '/spot',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    { 
      icon: <RiseOutlined />, 
      label: 'Future', 
      description: 'Sinh lời cao , kiếm tiền 2 chiều ',
      href: '/futures',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    },
    { 
      icon: <SiTradingview />, 
      label: 'Bảng giá', 
      description: 'Cập nhật realtime , thân thiện người dùng',
      href: '/wallet',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.quickActions}>
        {quickActions.map((action, index) => (
          <a 
            key={index} 
            href={action.href} 
            className={styles.actionButton}
            style={{ '--accent-color': action.color, '--gradient': action.gradient } as React.CSSProperties}
          >
            <div className={styles.iconContainer}>
              <div className={styles.actionIcon}>{action.icon}</div>
              <div className={styles.iconGlow}></div>
            </div>
            <div className={styles.textContainer}>
              <span className={styles.actionLabel}>{action.label}</span>
              <span className={styles.actionDescription}>{action.description}</span>
            </div>
            <div className={styles.hoverEffect}></div>
            <div className={styles.arrow}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TradingFeatures;