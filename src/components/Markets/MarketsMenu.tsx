"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MarketsMenu.module.css';

const MENU_ITEMS = [
    { label: 'Tiền mã hóa', path: '/markets/crypto' },
    { label: 'Spot', path: '/markets/spot' },
    { label: 'Futures', path: '/markets/futures' },
    { label: 'Quyền chọn', path: '/markets/options' },
];

export default function MarketsMenu() {
    const pathname = usePathname();

    return (
        <div className={styles.menuContainer}>
            {MENU_ITEMS.map((item) => {
                const isActive = pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </div>
    );
}
