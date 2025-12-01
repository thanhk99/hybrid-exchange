'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletOutlined, DollarOutlined, LineChartOutlined, RiseOutlined, FundOutlined } from '@ant-design/icons';
import styles from './BalanceSidebar.module.css';

interface MenuItem {
    path: string;
    icon: React.ReactNode;
    label: string;
    description: string;
}

export default function BalanceSidebar() {
    const pathname = usePathname();

    const menuItems: MenuItem[] = [
        {
            path: '/balance/overview',
            icon: <WalletOutlined />,
            label: 'Tổng quan',
            description: 'Xem tất cả tài sản'
        },
        {
            path: '/balance/funding',
            icon: <DollarOutlined />,
            label: 'Ví Funding',
            description: 'Nạp, rút và chuyển tiền'
        },
        {
            path: '/balance/spot',
            icon: <LineChartOutlined />,
            label: 'Ví Spot',
            description: 'Giao dịch và chuyển đổi'
        },
        {
            path: '/balance/futures',
            icon: <FundOutlined />,
            label: 'Ví Futures',
            description: 'Giao dịch hợp đồng tương lai'
        },
        {
            path: '/balance/earn',
            icon: <RiseOutlined />,
            label: 'Ví Earn',
            description: 'Kiếm lợi nhuận từ staking'
        }
    ];

    return (
        <div className={styles.sidebar}>
            <div className={styles.menu}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                        >
                            <div className={styles.menuItemInner}>
                                <div className={styles.menuIcon}>{item.icon}</div>
                                <div className={styles.menuContent}>
                                    <span className={styles.menuLabel}>{item.label}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
