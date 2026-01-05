'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notification, NotificationContextType, NotificationResponse } from '../types/notification';
import NotificationService from '../services/notification';
import TokenService from '../services/token';
import { useUser } from './UserContext';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store/store';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);

    const mapNotification = useCallback((item: any, defaultType?: string): Notification => {
        const notification: Notification = {
            id: item.id?.toString() || Date.now().toString(),
            title: item.notificationTitle || item.title || 'Thông báo',
            message: item.notificationContent || item.message || '',
            type: item.notificationType || item.type || defaultType || 'SYSTEM',
            isRead: item.read !== undefined ? item.read : (item.isRead || false),
            createdAt: item.createdAt || item.sentAt || new Date().toISOString(),
            userId: item.userId,
            data: {
                orderId: item.orderId || item.data?.orderId,
                tradeId: item.tradeId || item.data?.tradeId
            }
        };

        // Generate link based on data
        if (item.tradeId || (item.data && item.data.tradeId)) {
            notification.link = `/p2p/trade/${item.tradeId || item.data.tradeId}`;
        } else if (item.orderId || (item.data && item.data.orderId)) {
            if (notification.type === 'P2P_ORDER_CREATED' || notification.type === 'TRADE') {
                notification.link = `/p2p/trade/${item.orderId}`;
            }
        }

        return notification;
    }, []);

    const refreshNotifications = useCallback(async () => {
        if (!user?.uid) return;

        try {
            setLoading(true);
            setError(null);

            // Fetch unread count first
            const countResponse = await NotificationService.getUnreadCount();
            let count = 0;
            if (countResponse.data.data !== undefined) {
                const countData = countResponse.data.data;
                if (typeof countData === 'number') {
                    count = countData;
                } else if (typeof countData === 'object' && countData !== null && 'count' in countData) {
                    count = (countData as any).count;
                }
                setUnreadCount(count);
            }

            // Fetch notifications (page 0, size 20)
            let notifResponse = await NotificationService.getNotifications(0, 20);
            let fetchedNotifications: Notification[] = [];

            if (notifResponse.data.data) {
                const data = notifResponse.data.data;

                if (Array.isArray(data)) {
                    fetchedNotifications = data.map(item => mapNotification(item));
                } else if (data && 'content' in data) {
                    fetchedNotifications = (data as NotificationResponse).content.map(item => mapNotification(item));
                } else if (data && 'notifications' in data) {
                    // Backend returns { notifications: [], totalItems, totalPages, currentPage }
                    fetchedNotifications = (data as any).notifications.map((item: any) => mapNotification(item));
                }
            }

            setNotifications(fetchedNotifications);

        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.uid, mapNotification]);

    const markAsRead = useCallback(async (id: string) => {
        try {
            await NotificationService.markAsRead(id);

            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
            throw err;
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await NotificationService.markAllAsRead();

            // Update local state
            setNotifications(prev =>
                prev.map(n => ({ ...n, isRead: true }))
            );
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all notifications as read:', err);
            throw err;
        }
    }, []);

    const deleteNotification = useCallback(async (id: string) => {
        try {
            await NotificationService.deleteNotification(id);

            // Update local state
            const deletedNotification = notifications.find(n => n.id === id);
            setNotifications(prev => prev.filter(n => n.id !== id));

            if (deletedNotification && !deletedNotification.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error('Failed to delete notification:', err);
            throw err;
        }
    }, [notifications]);

    // Initial load
    useEffect(() => {
        refreshNotifications();
    }, [refreshNotifications]);

    // SSE Subscription
    useEffect(() => {
        if (!user?.uid) return;

        const connectSSE = () => {
            const token = accessToken || TokenService.getAccessToken();
            if (!token) return;

            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
            const url = `${baseUrl}/api/v1/sse/subscribe/${user.uid}?token=${token}`;

            console.log('🔌 [SSE] Connecting to:', url);

            const es = new EventSource(url);

            // Kiểm tra trạng thái kết nối
            es.onopen = () => {
                console.log("✅ [SSE] Connection opened");
                setError(null);
            };

            es.onerror = (err) => {
                console.error("❌ [SSE] Connection failed/lost, browser will auto-reconnect:", err);
            };

            // 1. Lắng nghe sự kiện kết nối thành công
            es.addEventListener("connected", (event) => {
                console.log("👋 [SSE] Server says:", event.data);
            });

            // 2. Lắng nghe thông báo (Chính)
            es.addEventListener("notification", (event) => {
                console.log("🔔 [SSE] New notification received:", event.data);
                try {
                    if (event.data) {
                        const rawNotification = JSON.parse(event.data);
                        const newNotification = mapNotification(rawNotification, 'notification');

                        setNotifications(prev => {
                            if (prev.some(n => n.id === newNotification.id)) {
                                return prev;
                            }
                            return [newNotification, ...prev];
                        });
                        setUnreadCount(prev => prev + 1);
                    }
                } catch (e) {
                    console.error("[SSE] Error parsing notification:", e);
                    console.error("[SSE] Raw data:", event.data);
                }
            });

            return es;
        };

        const eventSource = connectSSE();

        return () => {
            if (eventSource) {
                eventSource.close();
                console.log("🔌 [SSE] Connection closed");
            }
        };
    }, [user?.uid, accessToken, mapNotification]);



    const value: NotificationContextType = {
        notifications,
        unreadCount,
        loading,
        error,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
