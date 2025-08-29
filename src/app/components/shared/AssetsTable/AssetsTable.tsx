import React from 'react';
import Checkbox from '../Checkbox/Checkbox';
import styles from './AssetsTable.module.css';

interface AssetsTableProps {
  onSearch: (value: string) => void;
  onToggleHideSmall: () => void;
  onQuickConvert: () => void;
  hideSmallAssets: boolean;
}

const AssetsTable: React.FC<AssetsTableProps> = ({
  onSearch,
  onToggleHideSmall,
  onQuickConvert,
  hideSmallAssets
}) => {
  return (
    <div className={styles.assetsList}>
      <div className={styles.assetsHeader}>
        <div className={styles.assetsActions}>
          <Checkbox 
            label="Ẩn tài sản nhỏ"
            checked={hideSmallAssets}
            onChange={onToggleHideSmall}
          />
          <button 
            className={styles.convertButton}
            onClick={onQuickConvert}
          >
            Chuyển đổi nhanh
          </button>
        </div>
      </div>

      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📊</div>
        <h3>Không tìm thấy hồ sơ</h3>
        <p>Bắt đầu với giao dịch đầu tiên của bạn</p>
      </div>
    </div>
  );
};

export default AssetsTable;