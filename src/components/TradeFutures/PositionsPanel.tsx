"use client";

import { useState } from 'react';
import styles from './PositionsPanel.module.css';

export default function PositionsPanel() {
    const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'history'>('positions');

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'positions' ? styles.active : ''}`}
                    onClick={() => setActiveTab('positions')}
                >
                    Vị thế (0)
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'orders' ? styles.active : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Lệnh mở (0)
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    Lịch sử
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'positions' && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📊</div>
                        <p className={styles.emptyText}>Không có vị thế nào</p>
                        <p className={styles.emptySubtext}>Các vị thế của bạn sẽ hiển thị ở đây</p>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📋</div>
                        <p className={styles.emptyText}>Không có lệnh mở</p>
                        <p className={styles.emptySubtext}>Các lệnh đang chờ của bạn sẽ hiển thị ở đây</p>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🕐</div>
                        <p className={styles.emptyText}>Không có lịch sử</p>
                        <p className={styles.emptySubtext}>Lịch sử giao dịch của bạn sẽ hiển thị ở đây</p>
                    </div>
                )}
            </div>
        </div>
    );
}
