'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './device.module.css';

const DevicePage = () => {
  const router = useRouter();
  const [activeDevice, setActiveDevice] = useState<number | null>(null);

  const handleOptionClick = (deviceId: number, action: string) => {
    switch(action) {
      case 'logout':
        // Handle logout
        console.log(`Logout device ${deviceId}`);
        break;
      case 'details':
        // Show device details
        console.log(`Show details for device ${deviceId}`);
        break;
      default:
        break;
    }
    setActiveDevice(null);
  };

  // Menu items được tái sử dụng từ trang Security
  const devices = [
    {
      device: 'Chrome 138.0.0.0(Windows)',
      status: 'Hiện tại',
      loginTime: '20:40:43 28 thg 8, 2025',
      lastActive: '18:30:39 28 thg 8, 2025',
      region: 'VN',
      ip: '118.70.124.132'
    },
    {
      device: 'Chrome 138.0.0.0(Windows)',
      loginTime: '18:39:34 28 thg 8, 2025',
      lastActive: '15:29:45 5 thg 8, 2025',
      region: 'VN',
      ip: '118.70.124.132'
    },
    {
      device: 'Chrome 139.0.0.0(Windows)',
      loginTime: '12:27:01 28 thg 8, 2025',
      lastActive: '23:05:31 18 thg 8, 2025',
      region: 'VN',
      ip: '0.893.c64f:21e5:f5f4'
    },
    {
      device: 'PKQ110(Android)',
      loginTime: '14:46:22 5 thg 8, 2025',
      lastActive: '15:38:10 5 thg 8, 2025',
      region: 'VN',
      ip: '116.106.96.109'
    }
  ];

  return (
    <div className={styles.container}>      
      <div className={styles.breadcrumb}>
        <Link href="/account/security" className={styles.breadcrumbLink}>
          Trung tâm bảo mật
        </Link>
        <span className={styles.breadcrumbSeparator}>&gt;</span>
        <span>Quản lý thiết bị</span>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Quản lý thiết bị</h1>
          <p className={styles.description}>
            Quản lý quyền truy cập vào tài khoản bằng cách xem các thiết bị đang nhập gần đây và thông tin đăng nhập
          </p>
        </div>

        <div className={styles.warningBox}>
          <div className={styles.warningTitle}>
            <span>⚠️</span>
            <span>Luôn cảnh giác với bất kỳ hoạt động lạ nào</span>
          </div>
          <p>Nếu bạn phát hiện bất kỳ dấu hiệu đáng ngờ, hãy đổi mật khẩu để đảng nhập tài khoản và thiết bị được liên kết và báo mật tài khoản của bạn</p>
        </div>

        <table className={styles.deviceTable}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Tên thiết bị</th>
              <th className={styles.tableHeader}>Thời gian hoạt động gần nhất</th>
              <th className={styles.tableHeader}>Lần đăng nhập cuối cùng</th>
              <th className={styles.tableHeader}>Vị trí đăng nhập lần cuối</th>
              <th className={styles.tableHeader}>Địa chỉ IP</th>
              <th className={styles.tableHeader}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device, index) => (
              <tr key={index} className={styles.tableRow}>
                <td className={styles.tableCell} data-label="Tên thiết bị">
                  {device.device}
                  {device.status && (
                    <span className={styles.activeDevice}>Hiện tại</span>
                  )}
                </td>
                <td className={styles.tableCell} data-label="Thời gian hoạt động">
                  {device.loginTime}
                </td>
                <td className={styles.tableCell} data-label="Lần đăng nhập cuối">
                  {device.lastActive}
                </td>
                <td className={styles.tableCell} data-label="Vị trí">
                  {device.region}
                </td>
                <td className={styles.tableCell} data-label="IP">
                  {device.ip}
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.actionWrapper}>
                    <button 
                      className={styles.actionButton}
                      onClick={() => setActiveDevice(activeDevice === index ? null : index)}
                    >
                      ⋮
                    </button>
                    {activeDevice === index && (
                      <>
                        <div className={styles.overlay} onClick={() => setActiveDevice(null)} />
                        <div className={styles.optionsMenu}>
                          <button className={styles.optionItem}>
                            Xem chi tiết
                          </button>
                          {!device.status && (
                            <button className={styles.optionItem}>
                              Đăng xuất thiết bị
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DevicePage;