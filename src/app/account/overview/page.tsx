'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopMenuList from '../../component/shared/top-menu-list/TopMenuList';
import styles from './overview.module.css';

const OverviewPage = () => {
  const router = useRouter();
  const [hasBalance, setHasBalance] = useState(false); // Mock state for demo

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
  
  const notifications = [
    {
      date: '28/08/2025',
      title: 'OKX đưa ra tùy kỳ hạn mới futures vĩnh cửu TREEUSDT'
    },
    {
      date: '25/08/2025',
      title: 'OKX nay niêm yết hợp đồng futures vĩnh cửu của token JST'
    },
    {
      date: '23/08/2025',
      title: 'OKX niêm yết hợp đồng futures vĩnh cửu pre-market cho token WEF (World Elastic Financial)'
    }
  ];

  const renderBalanceSection = () => {
    if (!hasBalance) {
      return (
        <div className={styles.noBalanceCard}>
          <h2 className={styles.balanceTitle}>Bắt đầu nạp</h2>
          <p className={styles.balanceDesc}>Nạp crypto vào tài khoản</p>
          <button 
            className={styles.depositButton}
            onClick={() => router.push('/account/deposit')}
          >
            Nạp tiền
          </button>
        </div>
      );
    }

    return (
      <div className={styles.balanceCard}>
        <div className={styles.balanceHeader}>
          <h2 className={styles.balanceTitle}>Quản lý tài sản</h2>
          <button className={styles.hideBalanceButton}>
            <span className={styles.eyeIcon}>👁️</span>
          </button>
        </div>
        <div className={styles.balanceContent}>
          <div className={styles.totalBalance}>
            <span className={styles.balanceLabel}>Tổng tài sản ước tính</span>
            <span className={styles.balanceAmount}>≈ 0.00 USDT</span>
          </div>
          <div className={styles.balanceActions}>
            <button 
              className={styles.actionButton}
              onClick={() => router.push('/account/deposit')}
            >
              Nạp tiền
            </button>
            <button 
              className={styles.actionButton}
              onClick={() => router.push('/account/withdraw')}
            >
              Rút tiền
            </button>
            <button 
              className={styles.actionButton}
              onClick={() => router.push('/account/transfer')}
            >
              Chuyển khoản
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <TopMenuList menuItems={menuItems} defaultActive={0} />
      
      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.leftSection}>
            <div className={styles.userHeader}>
              <div className={styles.avatarSection}>
                <div className={styles.avatar}>
                  <img src="/default-avatar.png" alt="" className={styles.avatarImg} />
                </div>
                <div className={styles.userMeta}>
                  <div className={styles.email}>nhu***@gmail.com</div>
                  <div className={styles.userId}>
                    <span>719618597119037951</span>
                    <button className={styles.copyButton}>
                      <span className={styles.copyIcon}>📋</span>
                    </button>
                    <img src="/google-icon.png" alt="" className={styles.googleIcon} />
                  </div>
                </div>
              </div>
              <button className={styles.profileButton}>
                Xem hồ sơ
              </button>
            </div>

            {renderBalanceSection()}

            <div className={styles.startSection}>
              <h2 className={styles.startTitle}>Trở lại & Làm mới</h2>
              <div className={styles.startCard}>
                <div className={styles.startInfo}>
                  <div className={styles.startHeading}>
                    Tải khởi động hành trình crypto - Giao dịch và nhận đến 100K USDT!
                  </div>
                  <div className={styles.startDesc}>
                    Nạp crypto vào tài khoản
                  </div>
                </div>
                <button className={styles.depositButton}>Bắt đầu ngay</button>
              </div>
            </div>
          </div>

          <div className={styles.rightSection}>
            <div className={styles.notificationSection}>
              <div className={styles.notificationHeader}>
                <h2 className={styles.notificationTitle}>Thông báo</h2>
                <button className={styles.viewMoreButton}>Thêm ›</button>
              </div>
              <div className={styles.notificationList}>
                {notifications.map((notification, index) => (
                  <div key={index} className={styles.notificationItem}>
                    <div className={styles.notificationDate}>{notification.date}</div>
                    <div className={styles.notificationText}>{notification.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;