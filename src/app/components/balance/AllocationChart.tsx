import React from 'react';
import styles from './AllocationChart.module.css';

interface AllocationData {
  funding: number;
  trading: number;
  earn: number;
}

interface AllocationChartProps {
  data: AllocationData | null | undefined; // Cho phép data là null hoặc undefined
  totalValue: number;
}

const AllocationChart: React.FC<AllocationChartProps> = ({ data, totalValue }) => {
  // Gán giá trị mặc định nếu data là null hoặc undefined
  const { funding = 0, trading = 0, earn = 0 } = data || {};

  // Tính phần trăm, đảm bảo totalValue > 0 để tránh chia cho 0
  const fundingPercent = totalValue > 0 ? (funding / totalValue) * 100 : 0;
  const tradingPercent = totalValue > 0 ? (trading / totalValue) * 100 : 0;
  const earnPercent = totalValue > 0 ? (earn / totalValue) * 100 : 0;

  // Kiểm tra nếu không có dữ liệu để hiển thị
  if (funding === 0 && trading === 0 && earn === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <div className={styles.emptyText}>Không có dữ liệu để hiển thị</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.barContainer}>
        <div className={styles.bar}>
          <div
            className={`${styles.barSegment} ${styles.funding}`}
            style={{ width: `${fundingPercent}%` }}
          ></div>
          <div
            className={`${styles.barSegment} ${styles.trading}`}
            style={{ width: `${tradingPercent}%` }}
          ></div>
          <div
            className={`${styles.barSegment} ${styles.earn}`}
            style={{ width: `${earnPercent}%` }}
          ></div>
        </div>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.funding}`}></div>
          <span className={styles.legendLabel}>Funding</span>
          <span className={styles.legendValue}>
            ${funding.toFixed(2)} ({fundingPercent.toFixed(1)}%)
          </span>
        </div>

        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.trading}`}></div>
          <span className={styles.legendLabel}>Giao dịch</span>
          <span className={styles.legendValue}>
            ${trading.toFixed(2)} ({tradingPercent.toFixed(1)}%)
          </span>
        </div>

        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.earn}`}></div>
          <span className={styles.legendLabel}>Earn</span>
          <span className={styles.legendValue}>
            ${earn.toFixed(2)} ({earnPercent.toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export default AllocationChart;