'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    UserOutlined,
    LockOutlined,
    SafetyOutlined,
    SettingOutlined,
    MenuOutlined,
    CloseOutlined,
    RightOutlined
} from '@ant-design/icons';
import styles from './AccountSidebar.module.css';

interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
    description: string;
}

const menuItems: MenuItem[] = [
    {
        id: 'profile',
        label: 'Thông tin cá nhân',
        icon: <UserOutlined />,
        path: '/account/profile',
        description: 'Quản lý thông tin tài khoản'
    },
    {
        id: 'security',
        label: 'Bảo mật',
        icon: <LockOutlined />,
        path: '/account/security',
        description: 'Mật khẩu & xác thực 2FA'
    },
    {
        id: 'verification',
        label: 'Xác minh danh tính',
        icon: <SafetyOutlined />,
        path: '/account/verification',
        description: 'KYC & xác minh tài khoản'
    },
    {
        id: 'preferences',
        label: 'Tùy chọn',
        icon: <SettingOutlined />,
        path: '/account/preferences',
        description: 'Ngôn ngữ, tiền tệ, thông báo'
    }
];

export default function AccountSidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Toggle */}
            <button
                className={styles.mobileMenuToggle}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
                <span>Menu</span>
            </button>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.headerIcon}>
                        <UserOutlined />
                    </div>
                    <div className={styles.headerContent}>
                        <h2 className={styles.sidebarTitle}>Tài khoản</h2>
                        <p className={styles.sidebarSubtitle}>Quản lý tài khoản của bạn</p>
                    </div>
                </div>

                <nav className={styles.menu}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.id}
                                href={item.path}
                                className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <div className={styles.menuItemInner}>
                                    <div className={styles.menuIcon}>{item.icon}</div>
                                    <div className={styles.menuContent}>
                                        <div className={styles.menuLabel}>{item.label}</div>
                                        <div className={styles.menuDescription}>{item.description}</div>
                                    </div>
                                    <div className={styles.menuArrow}>
                                        <RightOutlined />
                                    </div>
                                </div>
                                {isActive && <div className={styles.activeIndicator} />}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.footerCard}>
                        <div className={styles.footerIcon}>💡</div>
                        <div className={styles.footerText}>
                            <strong>Mẹo bảo mật</strong>
                            <p>Bật xác thực 2FA để bảo vệ tài khoản</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
