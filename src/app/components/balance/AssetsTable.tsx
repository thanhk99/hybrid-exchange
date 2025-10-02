import React, { useState } from 'react';
import { WalletAsset } from '@/app/lib/api/springboot-api/funding';
import styles from './AssetsTable.module.css';

interface AssetsTableProps {
  assets: WalletAsset[] | null | undefined; // Cho phép assets là null hoặc undefined
  onHideSmallAssets?: (hide: boolean) => void;
}

const AssetsTable: React.FC<AssetsTableProps> = ({ assets, onHideSmallAssets }) => {
  const [hideSmallAssets, setHideSmallAssets] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleHideSmallAssetsChange = (checked: boolean) => {
    setHideSmallAssets(checked);
    onHideSmallAssets?.(checked);
  };

  // Đảm bảo assets là mảng, nếu không thì trả về mảng rỗng
  const filteredAssets = Array.isArray(assets)
    ? assets.filter(asset => {
        if (hideSmallAssets && asset.value < 0.01) return false;
        if (
          searchTerm &&
          !asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !asset.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) return false;
        return true;
      })
    : [];

  const formatValue = (value: number) => {
    if (value < 0.01) return '<$0.01';
    return `$${value.toFixed(2)}`;
  };

  const formatHoldings = (holdings: number) => {
    if (holdings < 0.0001) return holdings.toFixed(8);
    if (holdings < 0.01) return holdings.toFixed(6);
    if (holdings < 1) return holdings.toFixed(4);
    return holdings.toFixed(2);
  };

  const formatPnl = (pnl: number, percentage: number) => {
    if (pnl === 0) return '--';
    const sign = pnl > 0 ? '+' : '';
    const pnlText = pnl < 0.01 ? '<$0.01' : `${sign}$${pnl.toFixed(2)}`;
    const percentageText = `(${sign}${percentage.toFixed(2)}%)`;
    return `${pnlText} ${percentageText}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm token"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.actions}>
          <label className={styles.hideSmallAssets}>
            <input
              type="checkbox"
              checked={hideSmallAssets}
              onChange={(e) => handleHideSmallAssetsChange(e.target.checked)}
            />
            Ẩn tài sản nhỏ
          </label>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {filteredAssets.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📊</div>
            <div className={styles.emptyText}>
              {searchTerm ? 'Không tìm thấy token phù hợp' : 'Không có tài sản nào'}
            </div>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Nắm giữ</th>
                <th>PNL giao dịch spot</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td>
                    <div className={styles.tokenInfo}>
                      <div className={styles.tokenIcon}>
                        {asset.logo ? (
                          <img src={asset.logo} alt={asset.symbol} />
                        ) : (
                          <span>{asset.symbol.charAt(0)}</span>
                        )}
                      </div>
                      <div className={styles.tokenDetails}>
                        <div className={styles.tokenSymbol}>{asset.symbol}</div>
                        <div className={styles.tokenName}>{asset.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.holdingsInfo}>
                      <div className={styles.holdingsAmount}>
                        {formatHoldings(asset.holdings)}
                      </div>
                      <div className={styles.holdingsValue}>
                        {formatValue(asset.value)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={`${styles.pnlInfo} ${asset.pnl >= 0 ? styles.positive : styles.negative}`}>
                      {formatPnl(asset.pnl, asset.pnlPercentage)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AssetsTable;