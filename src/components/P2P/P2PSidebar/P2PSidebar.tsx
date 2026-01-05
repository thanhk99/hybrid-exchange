'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ShoppingOutlined,
    PlusOutlined,
    UnorderedListOutlined,
    HistoryOutlined,
    CreditCardOutlined,
    UserOutlined,
    RightOutlined,
    BulbOutlined,
    MenuUnfoldOutlined,
    CloseOutlined,
    GlobalOutlined
} from '@ant-design/icons';
import styles from './P2PSidebar.module.css';

interface MenuItem {
    path: string;
    icon: React.ReactNode;
    label: string;
    description: string;
}

export default function P2PSidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const menuItems: MenuItem[] = [
        {
            path: '/p2p',
            icon: <ShoppingOutlined />,
            label: 'Chợ P2P',
            description: 'Mua bán Crypto trực tiếp'
        },
        {
            path: '/p2p/create',
            icon: <PlusOutlined />,
            label: 'Tạo quảng cáo',
            description: 'Đặt lệnh mua/bán của riêng bạn'
        },
        {
            path: '/p2p/orders',
            icon: <UnorderedListOutlined />,
            label: 'Quảng cáo của tôi',
            description: 'Quản lý các lệnh đang treo'
        },
        {
            path: '/p2p/trades',
            icon: <HistoryOutlined />,
            label: 'Lịch sử giao dịch',
            description: 'Xem các lệnh đã hoàn tất'
        },
        {
            path: '/p2p/payment-methods',
            icon: <CreditCardOutlined />,
            label: 'Phương thức thanh toán',
            description: 'Quản lý ngân hàng, ví điện tử'
        },
        {
            path: '/p2p/profile',
            icon: <UserOutlined />,
            label: 'Hồ sơ của tôi',
            description: 'Cài đặt và bảo mật P2P'
        }
    ];

    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button className={styles.mobileMenuToggle} onClick={toggleMobile}>
                {isMobileOpen ? <CloseOutlined /> : <MenuUnfoldOutlined />}
                <span>Menu P2P</span>
            </button>

            {/* Overlay */}
            <div
                className={`${styles.overlay} ${isMobileOpen ? styles.overlayActive : ''}`}
                onClick={() => setIsMobileOpen(false)}
            />

            <div className={`${styles.sidebar} ${isMobileOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.headerIcon}>
                        <GlobalOutlined />
                    </div>
                    <div className={styles.headerContent}>
                        <h2 className={styles.sidebarTitle}>Giao dịch P2P</h2>
                        <p className={styles.sidebarSubtitle}>Mua bán trực tiếp</p>
                    </div>
                </div>

                <div className={styles.menu}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                                onClick={() => setIsMobileOpen(false)}
                            >
                                <div className={styles.menuItemInner}>
                                    <div className={styles.menuIcon}>{item.icon}</div>
                                    <div className={styles.menuContent}>
                                        <span className={styles.menuLabel}>{item.label}</span>
                                        <span className={styles.menuDescription}>{item.description}</span>
                                    </div>
                                    <div className={styles.menuArrow}>
                                        <RightOutlined />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className={styles.sidebarFooter}>
                    <div className={styles.footerCard}>
                        <div className={styles.footerIcon}><BulbOutlined /></div>
                        <div className={styles.footerText}>
                            <strong>An toàn giao dịch</strong>
                            <p>Luôn yêu cầu xác nhận thanh toán trước khi giải phóng Token</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
