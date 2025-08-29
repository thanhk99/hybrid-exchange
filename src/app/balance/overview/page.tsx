'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopMenuList from '@/app/components/shared/top-menu-list/TopMenuList';
import styles from './overview.module.css';

const Overview = () => {
  const router = useRouter();
  const [hasBalance] = useState(false);
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

  return (
    <div className={styles.container}>
      <TopMenuList menuItems={menuItems} defaultActive={0} />
      
      <div className={styles.content}>
        <div className={styles.mainSection}>
          <div className={styles.balanceInfo}>
            <div className={styles.balanceHeader}>
              <h2>Tổng giá trị ước tính</h2>
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
                <option>đô la Mỹ</option>
              </select>
            </div>
            <div className={styles.profitInfo}>
              PnL hôm nay 0.00 đô la (0.00%)
            </div>
            <div className={styles.actionButtons}>
              <button 
                className={`${styles.actionBtn} ${styles.primary}`}
                onClick={() => router.push('/deposit')}
              >
                Tiền gửi
              </button>
              <button 
                className={styles.actionBtn}
                onClick={() => router.push('/convert')}
              >
                Chuyển thành
              </button>
              <button 
                className={styles.actionBtn}
                onClick={() => router.push('/withdraw')}
              >
                Rút
              </button>
              <button 
                className={styles.actionBtn}
                onClick={() => router.push('/transfer')}
              >
                Chuyển khoản
              </button>
            </div>

            <div className={styles.assetsList}>
              <div className={styles.assetsHeader}>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm token"
                  className={styles.searchInput}
                />
                <div className={styles.assetsActions}>
                  <label className={styles.hideSmallAssets}>
                    <input type="checkbox" />
                    Ẩn tài sản nhỏ
                  </label>
                  <button className={styles.convertButton}>Chuyển đổi nhanh</button>
                </div>
              </div>
              
              <table className={styles.assetsTable}>
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Có phần nắm giữ</th>
                    <th>Giao ngay PnL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className={styles.tokenInfo}>
                        <span className={styles.tokenIcon}>S</span>
                        <div>
                          <div>SOL</div>
                          <div className={styles.tokenName}>Solana</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>0.00012985</div>
                      <div className={styles.tokenValue}>0.02 đô la</div>
                    </td>
                    <td className={styles.profit}>+$0.01</td>
                  </tr>
                  {/* Add more token rows here */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;