'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopMenuList from '@/app/component/shared/top-menu-list/TopMenuList';
import styles from './trading.module.css';

const Trading = () => {
  const router = useRouter();
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const menuItems = [
    { title: 'Tổng quan', onClick: () => router.push('overview') },
    { title: 'Ví Funding', onClick: () => router.push('funding') },
    { title: 'Ví giao dịch', onClick: () => router.push('trading') },
    { title: 'Tăng trưởng', onClick: () => router.push('/growth') },
    { title: 'Phân tích', onClick: () => router.push('/analysis') },
    { title: 'Trung tâm lệnh', onClick: () => router.push('/orders') },
    { title: 'Phí', onClick: () => router.push('/fees') },
    { title: 'Sao kê tài khoản', onClick: () => router.push('/statements') },
    { title: 'Báo cáo P&R', onClick: () => router.push('/reports') }
  ];

  const recentTransactions = [
    {
      type: 'Chuyển tiền',
      amount: '-2.100838 USDT',
      time: '17:33:10 30/06/2025'
    },
    {
      type: 'Giao dịch',
      amount: '2.10083783 USDT',
      time: '17:31:46 30/06/2025'
    }
  ];

  const assets = [
    {
      name: 'SOL',
      fullName: 'Solana',
      icon: 'S',
      balance: '0.00012985',
      balanceUsd: '$0.02',
      ownedValue: '0.00012985',
      availableValue: '$141.48',
      pnl: '+$0.01',
      pnlPercentage: '+50.78%'
    },
    {
      name: 'OKSOL',
      fullName: 'OKX Liquid Staked Solana',
      icon: 'O',
      balance: '0.00000091',
      balanceUsd: '<$0.01',
      ownedValue: '0.00000091',
      availableValue: '--',
      pnl: '--',
      pnlPercentage: '--'
    }
  ];

  return (
    <div className={styles.container}>
      <TopMenuList menuItems={menuItems} defaultActive={2} />
      
      <div className={styles.content}>
        <div className={styles.mainSection}>
          <div className={styles.balanceCard}>
            <div className={styles.balanceHeader}>
              <h2>Giá trị vốn chủ sở hữu</h2>
              <button 
                className={styles.visibilityToggle}
                onClick={() => setIsBalanceHidden(!isBalanceHidden)}
              >
                👁
              </button>
            </div>

            <div className={`${styles.balanceAmount} ${isBalanceHidden ? styles.hidden : ''}`}>
              <span>0.02</span>
              <select className={styles.currencySelect}>
                <option>USD</option>
              </select>
            </div>

            <div className={styles.actionButtons}>
              <button className={`${styles.actionBtn} ${styles.primary}`}>
                Giao dịch
              </button>
              <button className={styles.actionBtn}>
                Chuyển đổi
              </button>
              <button className={styles.actionBtn}>
                Chuyển tiền
              </button>
            </div>
          </div>

          <div className={styles.assetsList}>
            <div className={styles.assetsHeader}>
              <h3>Tài sản</h3>
              <div className={styles.assetsActions}>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm token"
                  className={styles.searchInput}
                />
                <label className={styles.hideSmallAssets}>
                  <input type="checkbox" />
                  Ẩn tài sản nhỏ
                </label>
                <button className={styles.convertButton}>
                  Chuyển đổi nhanh
                </button>
              </div>
            </div>

            <table className={styles.assetsTable}>
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Vốn chủ sở hữu</th>
                  <th>Số dư</th>
                  <th>Giá vốn</th>
                  <th>PNL</th>
                  <th>Earn</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, index) => (
                  <tr key={index}>
                    <td>
                      <div className={styles.tokenInfo}>
                        <span className={styles.tokenIcon}>{asset.icon}</span>
                        <div>
                          <div>{asset.name}</div>
                          <div className={styles.tokenName}>{asset.fullName}</div>
                        </div>
                      </div>
                    </td>
                    <td>{asset.ownedValue}</td>
                    <td>{asset.balance}</td>
                    <td>{asset.availableValue}</td>
                    <td className={styles.profit}>{asset.pnl}</td>
                    <td>{asset.pnlPercentage}</td>
                    <td>
                      <button className={styles.moreButton}>...</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.sideSection}>
          <div className={styles.recentActivity}>
            <div className={styles.activityHeader}>
              <h3>Giao dịch gần đây</h3>
              <button className={styles.viewMore}>Xem thêm ›</button>
            </div>
            
            {recentTransactions.map((transaction, index) => (
              <div key={index} className={styles.transactionItem}>
                <div className={styles.transactionInfo}>
                  <span className={styles.transactionType}>{transaction.type}</span>
                  <span className={styles.transactionTime}>{transaction.time}</span>
                </div>
                <div className={styles.transactionAmount}>{transaction.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;