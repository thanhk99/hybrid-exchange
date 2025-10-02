import React from 'react';
import { SearchOutlined, EyeInvisibleOutlined, MoreOutlined } from '@ant-design/icons';
import styles from './FundingAssetsTable.module.css';

interface FundingAsset {
  name: string;
  fullName: string;
  icon: string;
  balance: string;
  balanceUsd: string;
  percentage: string;
}

interface FundingAssetsTableProps {
  assets: FundingAsset[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hideSmallAssets: boolean;
  onHideSmallAssetsChange: (hide: boolean) => void;
}

const FundingAssetsTable: React.FC<FundingAssetsTableProps> = ({
  assets,
  searchQuery,
  onSearchChange,
  hideSmallAssets,
  onHideSmallAssetsChange,
}) => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h3>Tài sản</h3>
        <div className={styles.tableActions}>
          <div className={styles.searchContainer}>
            <SearchOutlined className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm token"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <label className={styles.hideSmallAssets}>
            <input
              type="checkbox"
              checked={hideSmallAssets}
              onChange={(e) => onHideSmallAssetsChange(e.target.checked)}
              className={styles.checkbox}
            />
            <EyeInvisibleOutlined className={styles.hideIcon} />
            Ẩn tài sản nhỏ
          </label>
          
          <button className={styles.convertButton}>
            Chuyển đổi nhanh
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.assetsTable}>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Số dư</th>
              <th>% danh mục đầu tư</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <tr key={index} className={styles.assetRow}>
                <td>
                  <div className={styles.tokenInfo}>
                    <div className={styles.tokenIcon}>
                      {asset.icon}
                    </div>
                    <div className={styles.tokenDetails}>
                      <div className={styles.tokenName}>{asset.name}</div>
                      <div className={styles.tokenFullName}>{asset.fullName}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.balanceInfo}>
                    <div className={styles.balance}>{asset.balance}</div>
                    <div className={styles.balanceUsd}>{asset.balanceUsd}</div>
                  </div>
                </td>
                <td className={styles.percentage}>{asset.percentage}</td>
                <td>
                  <button className={styles.moreButton}>
                    <MoreOutlined />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FundingAssetsTable;