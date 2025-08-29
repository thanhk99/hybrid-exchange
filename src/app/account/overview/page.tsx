'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import TopMenuList from '../../components/shared/top-menu-list/TopMenuList';
import UserProfileHeader from '../../components/account/UserProfileHeader';
import BalanceOverviewCard from '../../components/account/BalanceOverviewCard';
import BalanceChart from '../../components/account/BalanceChart';
import PriceTable from '../../components/account/PriceTable';
import NotificationsPanel from '../../components/account/NotificationsPanel';
import { mockRootProps } from '../../accountOverviewMockData';
import styles from './overview.module.css';

const OverviewPage = () => {
  const router = useRouter();

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

  return (
    <div className={styles.container}>
      <TopMenuList menuItems={menuItems} defaultActive={0} />
      
      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.leftSection}>
            <UserProfileHeader
              email={mockRootProps.user.email}
              userId={mockRootProps.user.userId}
              avatar={mockRootProps.user.avatar}
              verificationStatus={mockRootProps.user.verificationStatus}
              country={mockRootProps.user.country}
              tier={mockRootProps.user.tier}
              isGoogleLinked={mockRootProps.user.isGoogleLinked}
              onViewProfile={handleViewProfile}
            />

            <BalanceOverviewCard
              initialBalance={mockRootProps.balance}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onConvert={handleConvert}
              onTransfer={handleTransfer}
            />

            <BalanceChart
              data={mockRootProps.balance.chartData}
            />

            <PriceTable
              tokens={mockRootProps.priceTableData.tokens}
              activeTab={mockRootProps.priceTableData.activeTab}
            />
          </div>

          <div className={styles.rightSection}>
            <NotificationsPanel
              notifications={mockRootProps.notifications}
              onViewMore={handleViewMore}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;