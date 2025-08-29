'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import TopMenuList from '../../component/shared/top-menu-list/TopMenuList';
import styles from './profile.module.css';

const ProfilePage = () => {
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

  return (
    <div className={styles.container}>
      <div className={styles.topMenu}>
        <TopMenuList menuItems={menuItems} />
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.card}>
          <h2 className={styles.title}>Thông tin</h2>
          
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin cá nhân</h3>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                <span>Ảnh</span>
              </div>
              <button className={styles.button}>Thay đổi</button>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Biệt danh</span>
              <span className={styles.value}>nhu***@gmail.com</span>
              <button className={styles.button}>Thay đổi</button>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>ID người dùng</span>
              <span className={styles.value}>719618597119037951</span>
              <button className={styles.button}>Sao chép</button>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin xác minh</h3>
            <div className={styles.row}>
              <span className={styles.label}>Xác minh danh tính</span>
              <span className={styles.verifiedText}>Đã xác minh</span>
              <button className={styles.button}>Xem chi tiết</button>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Quốc gia/Khu vực</span>
              <span className={styles.value}>Việt Nam</span>
              <button className={styles.button}>Xem chi tiết</button>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Chi tiết tài khoản</h3>
            <div className={styles.row}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>nhu***@gmail.com</span>
              <button className={styles.button}>Thay đổi</button>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Số điện thoại</span>
              <span className={styles.value}>****821</span>
              <button className={styles.button}>Thay đổi</button>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Đăng nhập qua bên thứ ba</span>
              <span className={styles.value}>Google</span>
              <button className={styles.button}>Quản lý</button>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Bậc phí giao dịch</span>
              <span className={styles.value}>Người dùng thông thường</span>
              <button className={styles.button}>Xem chi tiết</button>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Quyền lợi khi mời</span>
              <span className={styles.value}>0%</span>
              <button className={styles.button}>Xem chi tiết</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;