import React, { useState } from 'react';
import { PriceTableTab } from '../../accountOverviewMockData';
import styles from './PriceTable.module.css';

interface TokenPrice {
  name: string;
  fullName: string;
  price: number;
  change: number;
  changePercent: number;
}

interface PriceTableProps {
  tokens: TokenPrice[];
  activeTab?: PriceTableTab;
  onTabChange?: (tab: PriceTableTab) => void;
}

const PriceTable: React.FC<PriceTableProps> = ({
  tokens,
  activeTab = PriceTableTab.TOP,
  onTabChange
}) => {
  const [currentTab, setCurrentTab] = useState<PriceTableTab>(activeTab);

  const tabs = [
    { key: PriceTableTab.FAVORITES, label: 'Yêu thích' },
    { key: PriceTableTab.TOP, label: 'Hàng đầu' },
    { key: PriceTableTab.POPULAR, label: 'Phổ biến' },
    { key: PriceTableTab.GAINERS, label: 'Token giá tăng' },
    { key: PriceTableTab.NEW, label: 'Token mới' }
  ];

  const handleTabClick = (tab: PriceTableTab) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change: number): string => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const formatPercentage = (percent: number): string => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Giá tiền mã hóa hôm nay</h2>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`${styles.tab} ${currentTab === tab.key ? styles.active : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.nameHeader}>Tên</th>
              <th className={styles.priceHeader}>Giá</th>
              <th className={styles.changeHeader}>Thay đổi</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, index) => (
              <tr key={index} className={styles.tokenRow}>
                <td className={styles.nameCell}>
                  <div className={styles.tokenInfo}>
                    <div className={styles.tokenIcon}>
                      {token.name.charAt(0)}
                    </div>
                    <div className={styles.tokenDetails}>
                      <div className={styles.tokenName}>{token.name}</div>
                      <div className={styles.tokenFullName}>{token.fullName}</div>
                    </div>
                  </div>
                </td>
                <td className={styles.priceCell}>
                  ${formatPrice(token.price)}
                </td>
                <td className={styles.changeCell}>
                  <div className={`${styles.changeInfo} ${token.change >= 0 ? styles.positive : styles.negative}`}>
                    <div className={styles.changeAmount}>
                      {formatChange(token.change)}
                    </div>
                    <div className={styles.changePercent}>
                      {formatPercentage(token.changePercent)}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceTable;