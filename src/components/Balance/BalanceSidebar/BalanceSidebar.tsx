'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    WalletOutlined,
    PieChartOutlined,
    DatabaseOutlined,
    BankOutlined,
    LineChartOutlined,
    ThunderboltOutlined,
    RightOutlined,
    BulbOutlined,
    DownloadOutlined,
    UploadOutlined,
    SwapOutlined,
    SyncOutlined,
    MenuUnfoldOutlined,
    CloseOutlined
} from '@ant-design/icons';
import styles from './BalanceSidebar.module.css';

interface MenuItem {
    path: string;
    icon: React.ReactNode;
    label: string;
    description: string;
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}

export default function BalanceSidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const sections: MenuSection[] = [
        {
            title: 'Tổng quan',
            items: [
                {
                    path: '/balance/overview',
                    icon: <PieChartOutlined />,
                    label: 'Tổng quan tài sản',
                    description: 'Xem tất cả số dư ví'
                },
            ]
        },
        {
            title: 'Tài khoản ví',
            items: [
                {
                    path: '/balance/spot',
                    icon: <DatabaseOutlined />,
                    label: 'Fiat và Spot',
                    description: 'Giao dịch và nạp rút'
                },
                {
                    path: '/balance/funding',
                    icon: <BankOutlined />,
                    label: 'Funding',
                    description: 'P2P và thanh toán'
                },
                {
                    path: '/balance/futures',
                    icon: <LineChartOutlined />,
                    label: 'Futures',
                    description: 'Giao dịch ký quỹ'
                },
                {
                    path: '/balance/earn',
                    icon: <ThunderboltOutlined />,
                    label: 'Earn',
                    description: 'Lợi nhuận tiết kiệm'
                },
            ]
        },
        {
            title: 'Giao dịch tài sản',
            items: [
                {
                    path: '/assets/deposit',
                    icon: <DownloadOutlined />,
                    label: 'Nạp tiền',
                    description: 'Nạp coin vào ví'
                },
                {
                    path: '/assets/withdraw',
                    icon: <UploadOutlined />,
                    label: 'Rút tiền',
                    description: 'Rút coin ra ví ngoài'
                },
                {
                    path: '/assets/transfer',
                    icon: <SwapOutlined />,
                    label: 'Chuyển tiền',
                    description: 'Chuyển nội bộ ví'
                },
                {
                    path: '/assets/convert',
                    icon: <SyncOutlined />,
                    label: 'Chuyển đổi',
                    description: 'Swap nhanh coin'
                },
            ]
        }
    ];

    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button className={`${styles.mobileMenuToggle} ${isMobileOpen ? styles.toggleActive : ''}`} onClick={toggleMobile}>
                {isMobileOpen ? <CloseOutlined /> : <MenuUnfoldOutlined />}
                <span>{isMobileOpen ? 'Đóng' : 'Menu'}</span>
            </button>

            {/* Overlay */}
            <div
                className={`${styles.overlay} ${isMobileOpen ? styles.overlayActive : ''}`}
                onClick={() => setIsMobileOpen(false)}
            />

            <div className={`${styles.sidebar} ${isMobileOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.headerIcon}>
                        <WalletOutlined />
                    </div>
                    <div className={styles.headerContent}>
                        <h2 className={styles.sidebarTitle}>Ví của tôi</h2>
                        <p className={styles.sidebarSubtitle}>Quản lý tài sản số</p>
                    </div>
                </div>

                <div className={styles.menu}>
                    {sections.map((section, idx) => (
                        <React.Fragment key={idx}>
                            <div className={styles.menuTitle}>{section.title}</div>
                            {section.items.map((item) => {
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
                        </React.Fragment>
                    ))}
                </div>

                <div className={styles.sidebarFooter}>
                    <div className={styles.footerCard}>
                        <div className={styles.footerIcon}><BulbOutlined /></div>
                        <div className={styles.footerText}>
                            <strong>Phân bổ tài sản</strong>
                            <p>Đa dạng hóa danh mục để giảm thiểu rủi ro</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
