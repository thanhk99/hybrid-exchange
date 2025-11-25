import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title?: string;
    message: string;
}

export default function EmptyState({ icon, title, message }: EmptyStateProps) {
    return (
        <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
                {icon || <InfoCircleOutlined />}
            </div>
            {title && <h3 className={styles.emptyTitle}>{title}</h3>}
            <p className={styles.emptyMessage}>{message}</p>
        </div>
    );
}
