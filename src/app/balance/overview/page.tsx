'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopMenuList from '@/app/components/shared/top-menu-list/TopMenuList';
import BalanceChart from '@/app/components/account/BalanceChart';
import AllocationChart from '@/app/components/balance/AllocationChart';
import AssetsTable from '@/app/components/balance/AssetsTable';
import EmptyFundingHistory from '@/app/components/funding/EmptyFundingHistory';
import FundingService, { WalletResponse } from '@/app/lib/api/springboot-api/funding';
import styles from './overview.module.css';

const Overview = () => {
  const router = useRouter();
  const [walletData, setWalletData] = useState<WalletResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const menuItems = [
    { title: 'Tổng quan', onClick: () => router.push('/balance/overview') },
    { title: 'Ví Funding', onClick: () => router.push('/balance/funding') },
    { title: 'Ví giao dịch', onClick: () => router.push('/balance/trading') },
    { title: 'Tăng trưởng', onClick: () => router.push('/growth') },
    { title: 'Phân tích', onClick: () => router.push('/analysis') },
    { title: 'Trung tâm lệnh', onClick: () => router.push('/orders') },
    { title: 'Phí', onClick: () => router.push('/fees') },
    { title: 'Sao kê tài khoản', onClick: () => router.push('/statements') },
    { title: 'Báo cáo P&R', onClick: () => router.push('/reports') }
  ];

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const data = await FundingService.getWallet();
        setWalletData(data);
      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setError('Không thể tải dữ liệu wallet');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const formatCurrency = (value: number | null | undefined): string => {
    if (value == null || isNaN(value)) return '0.00'; // Xử lý undefined, null, hoặc NaN
    if (value < 0.01) return '0.02';
    return value.toFixed(2);
  };

  const formatPnl = (pnl: number | null | undefined, percentage: number | null | undefined): string => {
    // Nếu pnl hoặc percentage là null, undefined, hoặc NaN, trả về giá trị mặc định
    if (pnl == null || isNaN(pnl) || percentage == null || isNaN(percentage)) {
      return '$0.00 (0.00%)';
    }
    if (pnl === 0) return '$0.00 (0.00%)';
    const sign = pnl > 0 ? '+' : '';
    return `${sign}$${pnl.toFixed(2)} (${sign}${percentage.toFixed(2)}%)`;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <TopMenuList menuItems={menuItems} defaultActive={0} />
        <div className={styles.content}>
          <div className={styles.loading}>Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error || !walletData) {
    return (
      <div className={styles.container}>
        <TopMenuList menuItems={menuItems} defaultActive={0} />
        <div className={styles.content}>
          <div className={styles.error}>{error || 'Không thể tải dữ liệu'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TopMenuList menuItems={menuItems} defaultActive={0} />
      
      <div className={styles.content}>
        {/* Left Column - Main Content */}
        <div className={styles.mainSection}>
          {/* Balance Overview */}
          <div className={styles.balanceInfo}>
            <div className={styles.balanceHeader}>
              <h2>Tổng giá trị ước tính</h2>
              <button 
                className={styles.visibilityToggle}
                onClick={() => setIsBalanceHidden(!isBalanceHidden)}
              >
                {isBalanceHidden ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
            
            <div className={`${styles.balanceAmount} ${isBalanceHidden ? styles.hidden : ''}`}>
              <span>{formatCurrency(walletData.totalValue)}</span>
              <span className={styles.currency}>USD</span>
            </div>
            
            <div className={styles.profitInfo}>
              PNL hôm nay {formatPnl(walletData.pnlToday, walletData.pnlPercentage)}
            </div>
            
            <div className={styles.chartContainer}>
              <BalanceChart data={walletData.chartData} height={60} />
            </div>
            
            <div className={styles.actionButtons}>
              <button 
                className={`${styles.actionBtn} ${styles.primary}`}
                onClick={() => router.push('/deposit')}
              >
                Nạp tiền
              </button>
              <button 
                className={styles.actionBtn}
                onClick={() => router.push('/convert')}
              >
                Chuyển đổi
              </button>
              <button 
                className={styles.actionBtn}
                onClick={() => router.push('/withdraw')}
              >
                Rút tiền
              </button>
              <button 
                className={styles.actionBtn}
                onClick={() => router.push('/transfer')}
              >
                Chuyển tiền
              </button>
            </div>
          </div>

          {/* Assets List */}
          <div className={styles.assetsList}>
            <h3>Tài sản</h3>
            <AssetsTable assets={walletData.assets} />
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className={styles.sidebar}>
          {/* Allocation */}
          <div className={styles.allocationSection}>
            <h3>Phân bổ</h3>
            <AllocationChart 
              data={walletData.allocation} 
              totalValue={walletData.totalValue} 
            />
          </div>

          {/* Recent Funding History */}
          <div className={styles.historySection}>
            <h3>Lịch sử ví funding gần đây</h3>
            <EmptyFundingHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;