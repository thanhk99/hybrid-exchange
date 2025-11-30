'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    DesktopOutlined,
    MobileOutlined,
    DeleteOutlined,
    GlobalOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import DeviceService, { DeviceInfo } from '../../../services/device';
import styles from './page.module.css';

export default function DeviceManagementPage() {
    const router = useRouter();
    const [devices, setDevices] = useState<DeviceInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [revokingId, setRevokingId] = useState<string | null>(null);

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const response = await DeviceService.listDevices();
            if (response.data && response.data.data) {
                setDevices(response.data.data);
            }
        } catch (err) {
            console.error('Fetch devices error:', err);
            setError('Không thể tải danh sách thiết bị');
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (deviceId: string) => {
        if (!confirm('Bạn có chắc chắn muốn đăng xuất thiết bị này?')) return;

        setRevokingId(deviceId);
        setError('');
        setSuccess('');

        try {
            const response = await DeviceService.revokeDevice(deviceId);

            if ((response.data && response.data.data) || response.status === 200 || response.status === 201) {
                setSuccess('Đăng xuất thiết bị thành công');
                // Remove the revoked device from the list locally to update UI immediately
                setDevices(prev => prev.filter(d => d.deviceId !== deviceId));
            } else {
                setError(response.data?.message || 'Đăng xuất thất bại');
            }
        } catch (err: any) {
            console.error('Revoke error:', err);
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng xuất thiết bị');
        } finally {
            setRevokingId(null);
        }
    };

    const getDeviceIcon = (device: DeviceInfo) => {
        const name = (device.deviceName || '').toLowerCase();
        const type = (device.deviceType || '').toLowerCase();

        if (type.includes('mobile') || name.includes('phone') || name.includes('android') || name.includes('iphone')) {
            return <MobileOutlined />;
        }
        return <DesktopOutlined />;
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString('vi-VN');
        } catch (e) {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.loading}>Đang tải danh sách thiết bị...</div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <span onClick={() => router.push('/account/security')}>Trung tâm bảo mật</span>
                <span className={styles.separator}>›</span>
                <span>Quản lý thiết bị</span>
            </div>

            <h1 className={styles.pageTitle}>Quản lý thiết bị</h1>
            <p className={styles.pageDescription}>
                Quản lý các thiết bị đã đăng nhập vào tài khoản của bạn. Nếu thấy thiết bị lạ, hãy đăng xuất ngay lập tức.
            </p>

            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}

            {success && (
                <div className={styles.successMessage}>
                    {success}
                </div>
            )}

            <div className={styles.deviceList}>
                {devices.length === 0 ? (
                    <div className={styles.emptyState}>
                        Không tìm thấy thiết bị nào đang đăng nhập.
                    </div>
                ) : (
                    devices.map((device) => (
                        <div key={device.deviceId} className={`${styles.deviceItem} ${device.isCurrent ? styles.currentItem : ''}`}>
                            <div className={styles.deviceIcon}>
                                {getDeviceIcon(device)}
                            </div>
                            <div className={styles.deviceInfo}>
                                <div className={styles.deviceName}>
                                    {device.deviceName || 'Thiết bị không tên'}
                                    {device.isCurrent && <span className={styles.currentBadge}>Thiết bị này</span>}
                                </div>
                                <div className={styles.deviceDetails}>
                                    <span className={styles.detailItem}>
                                        <GlobalOutlined /> {device.ipAddress}
                                    </span>
                                    {device.location && (
                                        <span className={styles.detailItem}>
                                            📍 {device.location}
                                        </span>
                                    )}
                                    <span className={styles.detailItem}>
                                        <ClockCircleOutlined /> {formatDate(device.lastLogin)}
                                    </span>
                                </div>
                                <div className={styles.deviceMeta}>
                                    {device.browser && <span>{device.browser}</span>}
                                </div>
                            </div>
                            <div className={styles.deviceAction}>
                                {!device.isCurrent && (
                                    <button
                                        className={styles.revokeButton}
                                        onClick={() => handleRevoke(device.deviceId)}
                                        disabled={revokingId === device.deviceId}
                                    >
                                        {revokingId === device.deviceId ? 'Đang xử lý...' : <><DeleteOutlined /> Đăng xuất</>}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
