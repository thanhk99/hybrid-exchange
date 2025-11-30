'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingOutlined, PlusOutlined, UnorderedListOutlined, HistoryOutlined, CreditCardOutlined, UserOutlined } from '@ant-design/icons';
import styles from './P2PSidebar.module.css';

interface MenuItem {
    path: string;
    icon: React.ReactNode;
    label: string;
}

export default function P2PSidebar() {
    const pathname = usePathname();

    const menuItems: MenuItem[] = [
        {
            path: '/p2p',
            icon: <ShoppingOutlined />,
            label: 'Chợ P2P'
        },
        {
            path: '/p2p/create',
            icon: <PlusOutlined />,
            label: 'Tạo quảng cáo'
        },
        {
            path: '/p2p/orders',
            icon: <UnorderedListOutlined />,
            label: 'Quảng cáo của tôi'
        },
        {
            path: '/p2p/trades',
            icon: <HistoryOutlined />,
            label: 'Lịch sử giao dịch'
        },
        {
            path: '/p2p/payment-methods',
            icon: <CreditCardOutlined />,
            label: 'Phương thức thanh toán'
        },
        {
            path: '/p2p/profile',
            icon: <UserOutlined />,
            label: 'Hồ sơ của tôi'
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
