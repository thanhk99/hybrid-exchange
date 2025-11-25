'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserOutlined, CameraOutlined } from '@ant-design/icons';
import NicknameModal from '@/src/components/Profile/NicknameModal/NicknameModal';
import UserService from '@/src/services/user';
import { UserInfo } from '@/src/types/user';
import styles from './page.module.css';

export default function ProfilePage() {
    const router = useRouter();
    const [showNicknameModal, setShowNicknameModal] = useState(false);
    const [userProfile, setUserProfile] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await UserService.getProfile();
            if (response.data.data) {
                setUserProfile(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNickname = (newNickname: string) => {
        // TODO: Call API to update nickname
        if (userProfile) {
            setUserProfile({ ...userProfile, username: newNickname });
        }
        setShowNicknameModal(false);
    };

    const getKycStatusText = (status: string) => {
        switch (status) {
            case 'VERIFIED': return '🟢 Đã xác minh';
            case 'PENDING': return '🟡 Đang xử lý';
            case 'REJECTED': return '🔴 Bị từ chối';
            default: return '⚪ Chưa xác minh';
        }
    };

    const getUserLevelText = (level: string) => {
        switch (level) {
            case 'ADVANCED': return 'Người dùng nâng cao';
            case 'INTERMEDIATE': return 'Người dùng trung cấp';
            default: return 'Người dùng thông thường';
        }
    };

    const getCountryName = (code: string) => {
        const countries: Record<string, string> = {
            'vi': 'Việt Nam',
            'en': 'United States',
            'cn': 'China',
        };
        return countries[code] || code.toUpperCase();
    };

    const maskEmail = (email: string) => {
        const [username, domain] = email.split('@');
        if (username.length <= 3) return email;
        return `${username.substring(0, 3)}***@${domain}`;
    };

    const maskPhone = (phone: string | null) => {
        if (!phone) return 'Chưa cập nhật';
        if (phone.length <= 4) return phone;
        return `***${phone.substring(phone.length - 4)}`;
    };

    if (loading) {
        return (
            <div className={styles.profilePage}>
                <div className={styles.loading}>Đang tải...</div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className={styles.profilePage}>
                <div className={styles.error}>Không thể tải thông tin người dùng</div>
            </div>
        );
    }

    return (
        <div className={styles.profilePage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Thông tin</h1>
            </div>

            {/* Thông tin tài khoản */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatar}>
                            {userProfile.avatar ? (
                                <img src={userProfile.avatar} alt="Avatar" />
                            ) : (
                                <UserOutlined />
                            )}
                            <button className={styles.avatarEdit}>
                                <CameraOutlined />
                            </button>
                        </div>
                        <h2 className={styles.sectionTitle}>Thông tin tài khoản</h2>
                    </div>
                </div>

                <div className={styles.infoList}>
                    <div className={styles.infoRow}>
                        <label>Biệt danh</label>
                        <div className={styles.infoValue}>
                            <span>{userProfile.username}</span>
                            <button className={styles.editButton} onClick={() => setShowNicknameModal(true)}>
                                Thay đổi
                            </button>
                        </div>
                    </div>

                    <div className={styles.infoRow}>
                        <label>ID người dùng</label>
                        <div className={styles.infoValue}>
                            <span>{userProfile.uid}</span>
                            <button className={styles.editButton} onClick={() => navigator.clipboard.writeText(userProfile.uid)}>
                                Sao chép
                            </button>
                        </div>
                    </div>

                    <div className={styles.infoRow}>
                        <label>Email</label>
                        <div className={styles.infoValue}>
                            <span>{maskEmail(userProfile.email)}</span>
                            <button className={styles.editButton} onClick={() => router.push('/account/change-email')}>
                                Thay đổi
                            </button>
                        </div>
                    </div>

                    <div className={styles.infoRow}>
                        <label>Số điện thoại</label>
                        <div className={styles.infoValue}>
                            <span>{maskPhone(userProfile.phone)}</span>
                            <button className={styles.editButton}>Thay đổi</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Xác minh chi tiết */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Xác minh chi tiết</h2>
                <div className={styles.infoList}>
                    <div className={styles.infoRow}>
                        <label>Xác minh danh tính</label>
                        <div className={styles.infoValue}>
                            <span className={styles.statusBadge}>{getKycStatusText(userProfile.kycStatus)}</span>
                            <button className={styles.editButton} onClick={() => router.push('/account/verification')}>
                                Xem chi tiết
                            </button>
                        </div>
                    </div>

                    <div className={styles.infoRow}>
                        <label>Quốc gia/Khu vực</label>
                        <div className={styles.infoValue}>
                            <span>{getCountryName(userProfile.nation)}</span>
                            <button className={styles.editButton}>Xem chi tiết</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hồ sơ giao dịch */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Hồ sơ giao dịch</h2>
                <div className={styles.infoList}>
                    <div className={styles.infoRow}>
                        <label>Cấp độ người dùng</label>
                        <div className={styles.infoValue}>
                            <span>{getUserLevelText(userProfile.userLevel)}</span>
                            <button className={styles.editButton}>Xem chi tiết</button>
                        </div>
                    </div>

                    <div className={styles.infoRow}>
                        <label>Trạng thái tài khoản</label>
                        <div className={styles.infoValue}>
                            <span>{userProfile.userStatus === 'ACTIVE' ? '🟢 Hoạt động' : '🔴 Không hoạt động'}</span>
                            <button className={styles.editButton}>Xem chi tiết</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tài khoản đã liên kết */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Tài khoản đã liên kết</h2>
                <div className={styles.infoList}>
                    <div className={styles.infoRow}>
                        <label>Đăng nhập qua Mật khẩu</label>
                        <div className={styles.infoValue}>
                            <span className={styles.linkedIcon}>🔗</span>
                            <button className={styles.editButton} onClick={() => router.push('/account/security')}>
                                Quản lý
                            </button>
                        </div>
                    </div>

                    <div className={styles.infoRow}>
                        <label>Tài khoản X</label>
                        <div className={styles.infoValue}>
                            <span>Chưa liên kết</span>
                            <button className={styles.editButton}>Liên kết ngay</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Nickname Modal */}
            <NicknameModal
                isOpen={showNicknameModal}
                nickname={userProfile.username}
                onClose={() => setShowNicknameModal(false)}
                onSave={handleSaveNickname}
            />
        </div>
    );
}
