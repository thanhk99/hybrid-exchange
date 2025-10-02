'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { profileService } from '../../../services/profileService';
import { LoginDevice } from '../../../types/profile';
import styles from './device.module.css';

const DevicePage = () => {
  const router = useRouter();
  const [activeDevice, setActiveDevice] = useState<number | null>(null);
  const [devices, setDevices] = useState<LoginDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch devices data from backend
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await profileService.getLoginDevices();
        console.log('Devices response:', response);
        
        if (response.message === 'success' && response.data) {
          setDevices(response.data);
        } else {
          setError(response.message || 'Failed to fetch devices');
        }
      } catch (err) {
        console.error('Error fetching devices:', err);
        if (err instanceof Error) {
          setError(`Failed to load devices: ${err.message}`);
        } else {
          setError('Failed to load devices');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const handleOptionClick = async (deviceId: string, action: string) => {
    switch(action) {
      case 'logout':
        try {
          console.log(`Revoking device: ${deviceId}`);
          const response = await profileService.logoutDevice();
          console.log('Revoke response:', response);
          
          if (response.success || response.message === 'success') {
            // Refresh devices list
            const updatedDevices = devices.filter(device => device.deviceId !== deviceId);
            setDevices(updatedDevices);
            console.log(`Device ${deviceId} revoked successfully`);
            
            // Hiển thị thông báo thành công (có thể dùng toast)
            console.log('Thiết bị đã được đăng xuất thành công!');
          } else {
            console.error('Failed to revoke device:', response.message);
            console.log(`Không thể đăng xuất thiết bị: ${response.message}`);
          }
        } catch (err) {
          console.error('Error revoking device:', err);
          console.log('Có lỗi xảy ra khi đăng xuất thiết bị. Vui lòng thử lại.');
        }
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

  // Format date function
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Get device display name
  const getDeviceDisplayName = (device: LoginDevice) => {
    if (device.deviceName) return device.deviceName;
    return `${device.browser} ${device.os}`;
  };

  if (loading) {
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
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error && devices.length === 0) {
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
          <div className="flex items-center justify-center py-12">
            <div className="text-red-500">Lỗi: {error}</div>
          </div>
        </div>
      </div>
    );
  }

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
          <p>Nếu bạn phát hiện bất kỳ dấu hiệu đáng ngờ, hãy đổi mật khẩu để đăng nhập tài khoản và thiết bị được liên kết và báo mật tài khoản của bạn</p>
        </div>

        {devices.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Không có thiết bị nào được tìm thấy</p>
          </div>
        ) : (
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
                <tr key={device.deviceId} className={styles.tableRow}>
                  <td className={styles.tableCell} data-label="Tên thiết bị">
                    {getDeviceDisplayName(device)}
                    {device.isCurrentDevice && (
                      <span className={styles.activeDevice}>Hiện tại</span>
                    )}
                  </td>
                  <td className={styles.tableCell} data-label="Thời gian hoạt động">
                    {formatDate(device.lastActiveAt)}
                  </td>
                  <td className={styles.tableCell} data-label="Lần đăng nhập cuối">
                    {formatDate(device.lastLoginAt)}
                  </td>
                  <td className={styles.tableCell} data-label="Vị trí">
                    {device.country || device.region || 'Không xác định'}
                  </td>
                  <td className={styles.tableCell} data-label="IP">
                    {device.ipAddress}
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
                            <button 
                              className={styles.optionItem}
                              onClick={() => handleOptionClick(device.deviceId, 'details')}
                            >
                              Xem chi tiết
                            </button>
                            {!device.isCurrentDevice && (
                              <button 
                                className={styles.optionItem}
                                onClick={() => handleOptionClick(device.deviceId, 'logout')}
                              >
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
        )}
      </div>
    </div>
  );
};

export default DevicePage;