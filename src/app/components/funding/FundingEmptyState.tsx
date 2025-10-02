import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import styles from './FundingEmptyState.module.css';

interface FundingEmptyStateProps {
  title?: string;
  subtitle?: string;
  searchQuery?: string;
  onClearSearch?: () => void;
  showSearchClear?: boolean;
}

const FundingEmptyState: React.FC<FundingEmptyStateProps> = ({
  title = "Không tìm thấy hồ sơ",
  subtitle = "Bắt đầu giao dịch đầu tiên của bạn",
  searchQuery,
  onClearSearch,
  showSearchClear = true
}) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <img 
          src="https://images.unsplash.com/photo-1634833650314-ed773bcc5b23?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxmb2xkZXIlMjBkb2N1bWVudCUyMG1hZ25pZnlpbmclMjBnbGFzcyUyMHNlYXJjaHxlbnwwfDJ8fHwxNzU2NDQ1MzQwfDA&ixlib=rb-4.1.0&q=85"
          alt="Empty folder illustration by MJH SHIKDER on Unsplash"
          className={styles.emptyImage}
          width="120"
          height="120"
        />
        <SearchOutlined className={styles.searchOverlay} />
      </div>
      
      <div className={styles.emptyContent}>
        <h3 className={styles.emptyTitle}>{title}</h3>
        <p className={styles.emptySubtitle}>{subtitle}</p>
        
        {showSearchClear && searchQuery && onClearSearch && (
          <button 
            onClick={onClearSearch}
            className={styles.clearButton}
          >
            Xóa bộ lọc tìm kiếm
          </button>
        )}
      </div>
    </div>
  );
};

export default FundingEmptyState;