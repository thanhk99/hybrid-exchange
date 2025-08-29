'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopMenuList from '@/app/components/shared/top-menu-list/TopMenuList';
import BalanceCard from '@/app/components/shared/BalanceCard/BalanceCard';
import FundingAssetsTable from '@/app/components/funding/FundingAssetsTable';
import FundingEmptyState from '@/app/components/funding/FundingEmptyState';
import styles from './funding.module.css';

const Funding = () => {
  const router = useRouter();
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hideSmallAssets, setHideSmallAssets] = useState(false);

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

  // Mock data for funding assets - matching the image shows OKSOL token
  const fundingAssets = [
    {
      name: 'OKSOL',
      fullName: 'OKX Liquid Staked Solana',
      icon: 'O',
      balance: '0.0000079',
      balanceUsd: '$0',
      percentage: '100.00%'
    }
  ];

  const filteredAssets = fundingAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const isSmallAsset = parseFloat(asset.balanceUsd.replace('$', '').replace('<', '')) < 0.01;
    
    if (hideSmallAssets && isSmallAsset) return false;
    return matchesSearch;
  });

  const balanceActions = [
    {
      label: 'Nạp',
      isPrimary: true,
      onClick: () => console.log('Deposit clicked')
    },
    {
      label: 'Chuyển đổi',
      onClick: () => console.log('Convert clicked')
    },
    {
      label: 'Chuyển tiền',
      onClick: () => console.log('Transfer clicked')
    }
  ];

  return (
    <div className={styles.container}>
      <TopMenuList menuItems={menuItems} defaultActive={1} />
      
      <div className={styles.content}>
        <div className={styles.mainSection}>
          <BalanceCard
            title="Giá trị ước tính"
            amount="0"
            currency="USD"
            isHidden={isBalanceHidden}
            onToggleVisibility={() => setIsBalanceHidden(!isBalanceHidden)}
            actions={balanceActions}
          />

          <div className={styles.fundingSection}>
            <div className={styles.sectionHeader}>
              <h2>Lịch sử ví funding gần đây</h2>
            </div>

            {filteredAssets.length > 0 ? (
              <FundingAssetsTable
                assets={filteredAssets}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                hideSmallAssets={hideSmallAssets}
                onHideSmallAssetsChange={setHideSmallAssets}
              />
            ) : (
              <FundingEmptyState 
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
              />
            )}
          </div>
        </div>

        <div className={styles.sideSection}>
          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <h3>Lịch sử ví funding gần đây</h3>
            </div>
            <div className={styles.emptyHistory}>
              <FundingEmptyState 
                title="Không tìm thấy hồ sơ"
                subtitle="Bắt đầu giao dịch đầu tiên của bạn"
                showSearchClear={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Funding;