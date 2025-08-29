import React from 'react';
import styles from './EmptyFundingHistory.module.css';

const EmptyFundingHistory: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>📄</div>
      <div className={styles.title}>Không tìm thấy hồ sơ</div>
      <div className={styles.subtitle}>Bắt đầu giao dịch đầu tiên của bạn</div>
    </div>
  );
};

export default EmptyFundingHistory;
