'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import TopMenuList from '../../components/shared/top-menu-list/TopMenuList';
import UserProfileHeader from '../../components/account/UserProfileHeader';
import BalanceOverviewCard from '../../components/account/BalanceOverviewCard';
import BalanceChart from '../../components/account/BalanceChart';
import PriceTable from '../../components/account/PriceTable';
import NotificationsPanel from '../../components/account/NotificationsPanel';
import { FundingService } from '../../lib/api';
import userService from '@/app/lib/api/springboot-api/user';
import { VerificationStatus, UserTier, PriceTableTab } from '../../accountOverviewMockData';
import styles from './overview.module.css';

const OverviewPage = () => {
  const router = useRouter();
  const { email, userId, isAuthenticated } = useSelector((state: any) => state.auth);
  
  const [userData, setUserData] = useState({
    email: '',
    userId: '',
    avatar: '',
    verificationStatus: VerificationStatus.UNVERIFIED,
    country: 'Việt Nam',
    tier: UserTier.REGULAR,
    isGoogleLinked: false,
    firstName: '',
    lastName: '',
    phone: ''
  });
  
  const [balanceData, setBalanceData] = useState({
    totalValue: 0,
    currency: "USD",
    pnlToday: 0,
    pnlPercentage: 0,
    chartData: []
  });
  
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserLoading(true);
        setUserError(null);
        const userResponse = await userService.getUser();
        console.log('User API response:', userResponse);
        
        // Cập nhật user data với data thực từ API
        // Điều chỉnh mapping này dựa trên cấu trúc response thực tế từ API
        setUserData({
          email: userResponse.email || email || '',
          userId: userResponse.userId || userId || '',
          avatar: userResponse.avatar || userResponse.profilePicture || `https://i.pravatar.cc/150?u=${email}`,
          verificationStatus: userResponse.verificationStatus || VerificationStatus.VERIFIED,
          country: userResponse.country || 'Việt Nam',
          tier: userResponse.tier || UserTier.REGULAR,
          isGoogleLinked: userResponse.isGoogleLinked || false,
          firstName: userResponse.firstName || userResponse.fullName?.split(' ')[0] || '',
          lastName: userResponse.lastName || userResponse.fullName?.split(' ').slice(1).join(' ') || '',
          phone: userResponse.phone || userResponse.phoneNumber || ''
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setUserError('Không thể tải thông tin người dùng');
        // Sử dụng data từ Redux store khi có lỗi
        setUserData({
          email: email || '',
          userId: userId || '',
          avatar: `https://i.pravatar.cc/150?u=${email}`,
          verificationStatus: VerificationStatus.UNVERIFIED,
          country: 'Việt Nam',
          tier: UserTier.REGULAR,
          isGoogleLinked: false,
          firstName: '',
          lastName: '',
          phone: ''
        });
      } finally {
        setUserLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    } else {
      setUserLoading(false);
      router.push('/login');
    }
  }, [isAuthenticated, email, userId, router]);

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

    if (isAuthenticated) {
      fetchBalance();
    }
  }, [isAuthenticated]);

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

  // Hiển thị loading khi đang fetch cả user data và balance data
  const isLoading = userLoading || loading;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <TopMenuList menuItems={menuItems} defaultActive={0} />
        <div className={styles.contentWrapper}>
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Đang tải thông tin...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <TopMenuList menuItems={menuItems} defaultActive={0} />
        <div className={styles.contentWrapper}>
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Vui lòng đăng nhập để xem thông tin</div>
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
              email={userData.email}
              userId={userData.userId}
              avatar={userData.avatar}
              verificationStatus={userData.verificationStatus}
              country={userData.country}
              tier={userData.tier}
              isGoogleLinked={userData.isGoogleLinked}
              onViewProfile={handleViewProfile}
            />

            {(userError || error) && (
              <div className={styles.errorContainer}>
                {userError && <div className={styles.errorMessage}>{userError}</div>}
                {error && <div className={styles.errorMessage}>{error}</div>}
              </div>
            )}

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