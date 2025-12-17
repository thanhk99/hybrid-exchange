'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notification, NotificationContextType, NotificationResponse } from '../types/notification';
import NotificationService from '../services/notification';
import TokenService from '../services/token';
import { useUser } from './UserContext';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();

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

        let retryTimeout: NodeJS.Timeout;
        const controller = new AbortController();

        const connectSSE = async () => {
            const token = TokenService.getAccessToken();
            if (!token) return;

            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
            const url = `${baseUrl}/api/v1/sse/subscribe/${user.uid}?token=${token}`;

            console.log('[SSE] Connecting to:', url);

            try {
                const response = await fetch(url, {
                    headers: {
                        Accept: 'text/event-stream',
                    },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`SSE Connection failed: ${response.status} ${response.statusText}`);
                }

                console.log('[SSE] Connected successfully');
                setError(null);

                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                if (!reader) return;

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    buffer += chunk;

                    // Normalize newlines
                    const normalizedBuffer = buffer.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                    const parts = normalizedBuffer.split('\n\n');

                    buffer = parts.pop() || '';

                    for (const part of parts) {
                        const lines = part.split('\n');
                        let eventType = 'message';
                        let data = '';

                        for (const line of lines) {
                            const trimLine = line.trim();
                            if (!trimLine) continue;

                            if (/^event:/i.test(trimLine)) {
                                eventType = trimLine.slice(6).trim();
                            } else if (/^data:/i.test(trimLine)) {
                                const lineData = trimLine.slice(5).trim();
                                if (!data) {
                                    data = lineData;
                                } else {
                                    data += '\n' + lineData;
                                }
                            }
                        }

                        if (!data) continue;

                        console.log(`[SSE] Received event: ${eventType}`, data);

                        if (eventType === 'connected') {
                            continue;
                        }

                        try {
                            if (data.startsWith('{') || data.startsWith('[')) {
                                const rawNotification = JSON.parse(data);
                                // Pass eventType as fallback
                                const newNotification = mapNotification(rawNotification, eventType);

                                setNotifications(prev => {
                                    if (prev.some(n => n.id === newNotification.id)) {
                                        return prev;
                                    }
                                    return [newNotification, ...prev];
                                });
                                setUnreadCount(prev => prev + 1);
                            } else {
                                console.log('[SSE] Non-JSON data:', data);
                            }
                        } catch (e) {
                            console.error("[SSE] Error parsing message:", e);
                            console.error("[SSE] Raw data:", data);
                        }
                    }
                }

            } catch (err: any) {
                if (err.name === 'AbortError') return;

                console.error("SSE Error:", err);
                retryTimeout = setTimeout(() => {
                    connectSSE();
                }, 5000);
            }
        };

        connectSSE();

        return () => {
            controller.abort();
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
        };
    }, [user?.uid, mapNotification]);



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
