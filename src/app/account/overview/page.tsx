'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopMenuList from '../../components/shared/top-menu-list/TopMenuList';
import UserProfileHeader from '../../components/account/UserProfileHeader';
import BalanceOverviewCard from '../../components/account/BalanceOverviewCard';
import BalanceChart from '../../components/account/BalanceChart';
import PriceTable from '../../components/account/PriceTable';
import NotificationsPanel from '../../components/account/NotificationsPanel';
import { FundingService } from '../../lib/api';
import { VerificationStatus, UserTier, PriceTableTab } from '../../accountOverviewMockData';
import styles from './overview.module.css';

const OverviewPage = () => {
  const router = useRouter();
  const [balanceData, setBalanceData] = useState({
    totalValue: 0,
    currency: "USD",
    pnlToday: 0,
    pnlPercentage: 0,
    chartData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch balance data from API
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await FundingService.getFundingTotal();
        console.log('Balance API response:', data);
        
        // Cập nhật balance data với data thực từ API
        setBalanceData({
          totalValue: data.totalValue || 0,
          currency: data.currency || "USD",
          pnlToday: data.pnlToday || 0,
          pnlPercentage: data.pnlPercentage || 0,
          chartData: [] // chartData sẽ được lấy riêng từ API khác
        });
      } catch (err) {
        console.error('Error fetching balance:', err);
        setError('Không thể tải dữ liệu số dư');
        // Sử dụng data mặc định khi có lỗi
        setBalanceData({
          totalValue: 0,
          currency: "USD",
          pnlToday: 0,
          pnlPercentage: 0,
          chartData: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const menuItems = [
    { 
      title: 'Tổng quát', 
      onClick: () => router.push('/account/overview')
    },
    { 
      title: 'Thông tin', 
      onClick: () => router.push('/account/profile')
    },
    { 
      title: 'Cài đặt bảo mật', 
      onClick: () => router.push('/account/security')
    },
    { 
      title: 'Xác minh', 
      onClick: () => router.push('/account/verification')
    },
    { 
      title: 'Tùy chọn', 
      onClick: () => router.push('/account/preferences')
    },
    { 
      title: 'Tài khoản phụ', 
      onClick: () => router.push('/account/sub-accounts')
    },
    { 
      title: 'API', 
      onClick: () => router.push('/account/api')
    },
    { 
      title: 'Ủy quyền của bên thứ ba', 
      onClick: () => router.push('/account/third-party')
    },
  ];

  const handleDeposit = () => router.push('/account/deposit');
  const handleWithdraw = () => router.push('/account/withdraw');
  const handleConvert = () => router.push('/account/convert');
  const handleTransfer = () => router.push('/account/transfer');
  const handleViewProfile = () => router.push('/account/profile');
  const handleViewMore = () => router.push('/account/notifications');

  if (loading) {
    return (
      <div className={styles.container}>
        <TopMenuList menuItems={menuItems} defaultActive={0} />
        <div className={styles.contentWrapper}>
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TopMenuList menuItems={menuItems} defaultActive={0} />
      
      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.leftSection}>
            <UserProfileHeader
              email="user@example.com"
              userId="123456789"
              avatar="https://i.pravatar.cc/150?img=1"
              verificationStatus={VerificationStatus.VERIFIED}
              country="Việt Nam"
              tier={UserTier.REGULAR}
              isGoogleLinked={false}
              onViewProfile={handleViewProfile}
            />

            <BalanceOverviewCard
              initialBalance={balanceData}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onConvert={handleConvert}
              onTransfer={handleTransfer}
            />

            <BalanceChart
              data={balanceData.chartData}
            />

            <PriceTable
              tokens={[]}
              activeTab={PriceTableTab.TOP}
            />
          </div>

          <div className={styles.rightSection}>
            <NotificationsPanel
              notifications={[]}
              onViewMore={handleViewMore}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;