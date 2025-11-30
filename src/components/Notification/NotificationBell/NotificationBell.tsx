'use client';

import React, { useState } from 'react';
import { Badge, Dropdown, Button, Spin, Empty } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { useNotifications } from '../../../contexts/NotificationContext';
import NotificationItem from '../NotificationItem/NotificationItem';
import Link from 'next/link';
import './NotificationBell.css';

const NotificationBell: React.FC = () => {
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Get latest 5 notifications for dropdown
    const recentNotifications = notifications.slice(0, 5);

    const handleMarkAllAsRead = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await markAllAsRead();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const dropdownContent = (
        <div className="notification-dropdown">
            <div className="notification-dropdown-header">
                <h3>Thông báo</h3>
                {unreadCount > 0 && (
                    <Button
                        type="link"
                        size="small"
                        icon={<CheckOutlined />}
                        onClick={handleMarkAllAsRead}
                    >
                        Đánh dấu tất cả đã đọc
                    </Button>
                )}
            </div>

            <div className="notification-dropdown-body">
                {loading && notifications.length === 0 ? (
                    <div className="notification-loading">
                        <Spin />
                    </div>
                ) : recentNotifications.length > 0 ? (
                    <>
                        {recentNotifications.map(notification => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={markAsRead}
                                compact
                            />
                        ))}
                    </>
                ) : (
                    <Empty
                        description="Không có thông báo"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                )}
            </div>

            <div className="notification-dropdown-footer">
                <Link href="/notifications" onClick={() => setDropdownOpen(false)}>
                    Xem tất cả thông báo
                </Link>
            </div>
        </div>
    );

    return (
        <Dropdown
            popupRender={() => dropdownContent}
            trigger={['click']}
            open={dropdownOpen}
            onOpenChange={setDropdownOpen}
            placement="bottomRight"
            overlayClassName="notification-bell-dropdown"
        >
            <Badge count={unreadCount} overflowCount={99} offset={[-4, 4]}>
                <Button
                    type="text"
                    icon={<BellOutlined style={{ fontSize: '20px' }} />}
                    className="notification-bell-button"
                />
            </Badge>
        </Dropdown>
    );
};

export default NotificationBell;
