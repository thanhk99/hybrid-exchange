'use client';

import React, { useState, useEffect } from 'react';
import { Button, Empty, Spin, Tabs, Pagination } from 'antd';
import { CheckOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNotifications } from '../../../contexts/NotificationContext';
import NotificationItem from '../NotificationItem/NotificationItem';
import NotificationService from '../../../services/notification';
import { Notification } from '../../../types/notification';
import './NotificationList.css';

type TabKey = 'all' | 'unread';

const NotificationList: React.FC = () => {
    const {
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    } = useNotifications();

    const [activeTab, setActiveTab] = useState<TabKey>('all');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 10;

    const mapNotification = (item: any): Notification => {
        return {
            id: item.id.toString(),
            title: item.notificationTitle || item.title,
            message: item.notificationContent || item.message,
            type: item.notificationType || item.type || 'SYSTEM',
            isRead: item.read !== undefined ? item.read : item.isRead,
            createdAt: item.createdAt || item.sentAt,
            userId: item.userId,
            data: {
                orderId: item.orderId || item.data?.orderId,
                tradeId: item.tradeId || item.data?.tradeId
            },
            link: item.tradeId ? `/p2p/trade/${item.tradeId}` : undefined
        };
    };

    const fetchNotifications = async (page: number) => {
        setLoading(true);
        try {
            const response = await NotificationService.getNotifications(page, pageSize);
            if (response.data.data) {
                const data = response.data.data;
                if (data && 'notifications' in data) {
                    const mappedNotifications = (data as any).notifications.map(mapNotification);
                    setNotifications(mappedNotifications);
                    setTotalItems((data as any).totalItems || 0);
                }
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications(currentPage);
    }, [currentPage]);

    const filteredNotifications = activeTab === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            // Refresh current page
            fetchNotifications(currentPage);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await fetchNotifications(currentPage);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page - 1); // Ant Design Pagination is 1-based, backend is 0-based
    };

    const handleMarkAsRead = async (id: string) => {
        await markAsRead(id);
        // Update local state
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    };

    const handleDelete = async (id: string) => {
        await deleteNotification(id);
        // Refresh current page
        fetchNotifications(currentPage);
    };

    const tabItems = [
        {
            key: 'all',
            label: `Tất cả (${totalItems})`,
        },
        {
            key: 'unread',
            label: `Chưa đọc (${unreadCount})`,
        },
    ];

    return (
        <div className="notification-list-container">
            <div className="notification-list-header">
                <h1 className="notification-list-title">Thông báo</h1>
                <div className="notification-list-actions">
                    <Button
                        icon={<ReloadOutlined spin={isRefreshing} />}
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="refresh-button"
                    >
                        Làm mới
                    </Button>
                    {unreadCount > 0 && (
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={handleMarkAllAsRead}
                            className="mark-all-button"
                        >
                            Đánh dấu tất cả đã đọc
                        </Button>
                    )}
                </div>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as TabKey)}
                items={tabItems}
                className="notification-list-tabs"
            />

            <div className="notification-list-body">
                {loading ? (
                    <div className="notification-list-loading">
                        <Spin size="large" />
                        <p>Đang tải thông báo...</p>
                    </div>
                ) : filteredNotifications.length > 0 ? (
                    <>
                        <div className="notification-list-items">
                            {filteredNotifications.map(notification => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={handleMarkAsRead}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                        <div className="notification-list-pagination">
                            <Pagination
                                current={currentPage + 1}
                                pageSize={pageSize}
                                total={totalItems}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                showTotal={(total) => `Tổng ${total} thông báo`}
                            />
                        </div>
                    </>
                ) : (
                    <div className="notification-list-empty">
                        <Empty
                            description={
                                activeTab === 'unread'
                                    ? 'Không có thông báo chưa đọc'
                                    : 'Không có thông báo'
                            }
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationList;
