'use client';

import React from 'react';
import { Notification, NotificationCategory } from '../../../types/notification';
import {
    BellOutlined,
    DollarOutlined,
    SafetyOutlined,
    InfoCircleOutlined,
    GiftOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';
import './NotificationItem.css';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead?: (id: string) => void;
    onDelete?: (id: string) => void;
    compact?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onMarkAsRead,
    onDelete,
    compact = false
}) => {
    const getIcon = (type: NotificationCategory) => {
        switch (type) {
            case 'TRADE':
                return <DollarOutlined className="notification-icon trade" />;
            case 'PAYMENT':
                return <DollarOutlined className="notification-icon payment" />;
            case 'SECURITY':
                return <SafetyOutlined className="notification-icon security" />;
            case 'SYSTEM':
                return <InfoCircleOutlined className="notification-icon system" />;
            case 'PROMOTION':
                return <GiftOutlined className="notification-icon promotion" />;
            default:
                return <BellOutlined className="notification-icon default" />;
        }
    };

    const handleClick = () => {
        if (!notification.isRead && onMarkAsRead) {
            onMarkAsRead(notification.id);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onDelete) {
            onDelete(notification.id);
        }
    };

    const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
        addSuffix: true,
        locale: vi
    });

    const content = (
        <div
            className={`notification-item ${!notification.isRead ? 'unread' : ''} ${compact ? 'compact' : ''}`}
            onClick={handleClick}
        >
            <div className="notification-icon-wrapper">
                {getIcon(notification.type)}
            </div>

            <div className="notification-content">
                <div className="notification-header">
                    <h4 className="notification-title">{notification.title}</h4>
                    {!compact && onDelete && (
                        <button
                            className="notification-delete-btn"
                            onClick={handleDelete}
                            aria-label="Xóa thông báo"
                        >
                            <DeleteOutlined />
                        </button>
                    )}
                </div>

                <p className="notification-message">{notification.message}</p>

                <div className="notification-footer">
                    <span className="notification-time">{timeAgo}</span>
                    {!notification.isRead && <span className="notification-badge">Mới</span>}
                </div>
            </div>
        </div>
    );

    if (notification.link) {
        return (
            <Link href={notification.link} className="notification-link">
                {content}
            </Link>
        );
    }

    return content;
};

export default NotificationItem;
