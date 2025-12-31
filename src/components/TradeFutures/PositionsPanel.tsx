"use client";

import { useState } from 'react';
import { Empty } from 'antd';
import {
    FileTextOutlined,
    ProjectOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import styles from './PositionsPanel.module.css';

export default function PositionsPanel() {
    const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'history'>('positions');

    const renderEmpty = (text: string, subtext: string) => (
        <div className={styles.emptyState}>
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                    <div className={styles.emptyDescription}>
                        <p className={styles.emptyText}>{text}</p>
                        <p className={styles.emptySubtext}>{subtext}</p>
                    </div>
                }
            />
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'positions' ? styles.active : ''}`}
                        onClick={() => setActiveTab('positions')}
                    >
                        <ProjectOutlined /> Vị thế (0)
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'orders' ? styles.active : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <FileTextOutlined /> Lệnh mở (0)
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <HistoryOutlined /> Lịch sử
                    </button>
                </div>
                <div className={styles.actions}>
                    <button className={styles.actionBtn}>Đóng tất cả</button>
                </div>
            </div>

            <div className={styles.content}>
                {activeTab === 'positions' && renderEmpty('Không có vị thế nào', 'Các vị thế của bạn sẽ hiển thị ở đây')}
                {activeTab === 'orders' && renderEmpty('Không có lệnh mở', 'Các lệnh đang chờ của bạn sẽ hiển thị ở đây')}
                {activeTab === 'history' && renderEmpty('Không có lịch sử', 'Lịch sử giao dịch của bạn sẽ hiển thị ở đây')}
            </div>
        </div>
    );
}
