import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import styles from './InfoCard.module.css';

interface InfoCardProps {
    title: string;
    icon?: React.ReactNode;
    editable?: boolean;
    onEdit?: () => void;
    children: React.ReactNode;
}

export default function InfoCard({ title, icon, editable = false, onEdit, children }: InfoCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                    {icon && <span className={styles.cardIcon}>{icon}</span>}
                    <h3>{title}</h3>
                </div>
                {editable && onEdit && (
                    <button className={styles.editButton} onClick={onEdit}>
                        <EditOutlined /> Chỉnh sửa
                    </button>
                )}
            </div>
            <div className={styles.cardContent}>
                {children}
            </div>
        </div>
    );
}
