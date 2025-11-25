import React from 'react';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styles from './StatusBadge.module.css';

type StatusType = 'verified' | 'pending' | 'unverified' | 'success' | 'warning' | 'error';

interface StatusBadgeProps {
    status: StatusType;
    label: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
    const getIcon = () => {
        switch (status) {
            case 'verified':
            case 'success':
                return <CheckCircleOutlined />;
            case 'pending':
            case 'warning':
                return <ClockCircleOutlined />;
            case 'unverified':
            case 'error':
                return <CloseCircleOutlined />;
            default:
                return null;
        }
    };

    const getStatusClass = () => {
        switch (status) {
            case 'verified':
            case 'success':
                return styles.statusSuccess;
            case 'pending':
            case 'warning':
                return styles.statusWarning;
            case 'unverified':
            case 'error':
                return styles.statusError;
            default:
                return '';
        }
    };

    return (
        <span className={`${styles.badge} ${getStatusClass()}`}>
            {getIcon()}
            {label}
        </span>
    );
}
