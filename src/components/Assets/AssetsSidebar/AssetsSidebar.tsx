'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DownloadOutlined, UploadOutlined, SwapOutlined, SyncOutlined } from '@ant-design/icons';
import styles from './AssetsSidebar.module.css';

interface MenuItem {
    path: string;
    icon: React.ReactNode;
    label: string;
}

export default function AssetsSidebar() {
    const pathname = usePathname();

    const menuItems: MenuItem[] = [
        {
            path: '/assets/deposit',
            icon: <DownloadOutlined />,
            label: 'Nạp tiền'
        },
        {
            path: '/assets/withdraw',
            icon: <UploadOutlined />,
            label: 'Rút tiền'
        },
        {
            path: '/assets/transfer',
            icon: <SwapOutlined />,
            label: 'Chuyển'
        },
        {
            path: '/assets/convert',
            icon: <SyncOutlined />,
            label: 'Chuyển đổi'
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
                                {isActive && <div className={styles.activeIndicator} />}
                                <span className={styles.menuLabel}>{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
