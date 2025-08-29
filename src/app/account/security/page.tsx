'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import TopMenuList from '../../components/shared/top-menu-list/TopMenuList';
import styles from './security.module.css';

const SecurityPage = () => {
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
      <TopMenuList menuItems={menuItems} defaultActive={2} />
      
      <div className={styles.contentWrapper}>
        <div className={styles.card}>
          <h2 className={styles.title}>Trung tâm bảo mật</h2>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Mục bảo mật chờ xử lý</h3>
            <div className={styles.securityItem}>
              <div className={styles.itemLeft}>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>Bảo vệ tài khoản của bạn ngay bằng cách bật các tính năng bảo mật được đề xuất</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Phương thức xác thực</h3>
            <div className={styles.securityItem}>
              <div className={styles.itemLeft}>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>Khóa truy cập</div>
                  <div className={styles.itemDesc}>Trải nghiệm đăng nhập an toàn không cần mã khóa và mã xác thực</div>
                </div>
              </div>
              <button className={styles.button}>Quản lý</button>
            </div>

            <div className={styles.securityItem}>
              <div className={styles.itemLeft}>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>Xác thực qua điện thoại</div>
                  <div className={styles.itemDesc}>Nhận mã xác thực qua SMS hoặc cuộc gọi khi quản lý các tài sản và sử dụng các chức năng khác</div>
                </div>
              </div>
              <div className={styles.itemRight}>
                <span>***821</span>
                <button className={styles.button}>Thay đổi số điện thoại đi động</button>
              </div>
            </div>

            <div className={styles.securityItem}>
              <div className={styles.itemLeft}>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>Xác thực qua email</div>
                  <div className={styles.itemDesc}>Nhận mã xác thực qua email để đăng nhập và sử dụng các chức năng khác</div>
                </div>
              </div>
              <div className={styles.itemRight}>
                <span>nhu***@gmail.com</span>
                <button className={styles.button}>Thay đổi email</button>
              </div>
            </div>

            <div className={styles.securityItem}>
              <div className={styles.itemLeft}>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>Mật khẩu đăng nhập</div>
                  <div className={styles.itemDesc}>Thiết lập mật khẩu đăng nhập để đăng nhập vào tài khoản của bạn</div>
                </div>
              </div>
              <button className={styles.button}>Đổi mật khẩu</button>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Bảo mật nâng cao</h3>
            <div className={styles.securityItem}>
              <div className={styles.itemLeft}>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>Liên hệ khẩn cấp</div>
                  <div className={styles.itemDesc}>Thêm người tin cậy mà chúng tôi có thể liên hệ để đủ quản lý tài sản của bạn trong trường hợp khẩn cấp</div>
                </div>
              </div>
              <button className={styles.button}>Thêm liên hệ</button>
            </div>

            <div className={styles.securityItem}>
              <div className={styles.itemLeft}>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>Quản lý thiết bị</div>
                  <div className={styles.itemDesc}>Quản lý và xem hoạt động đăng nhập cùng thông tin về thiết bị</div>
                </div>
              </div>
              <button 
                className={styles.button}
                onClick={() => router.push('/account/security/device')}
              >
                Quản lý
              </button>
            </div>

            <div className={styles.securityItem}>
              <div className={styles.itemLeft}>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>Quyền giao dịch</div>
                  <div className={styles.itemDesc}>Thiết lập các công cụ và lệnh mã hóa có thể giao dịch của bạn</div>
                </div>
              </div>
              <button className={styles.button}>Tắt/Bật</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;