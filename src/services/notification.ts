import { AxiosResponse } from "axios";
import axiosInstance from "../libs/axios";
import { ApiResponse } from "../types/common";
import { Notification, NotificationResponse } from "../types/notification";

export default class NotificationService {
    /**
     * Get notifications with pagination
     * @param page Page number (0-based)
     * @param size Page size
     * @param unreadOnly Filter by unread status
     */
    static async getNotifications(
        page: number = 0,
        size: number = 20,
        unreadOnly: boolean = false
    ): Promise<AxiosResponse<ApiResponse<NotificationResponse | Notification[]>>> {
        if (unreadOnly) {
            return axiosInstance.get<ApiResponse<Notification[]>>('/api/v1/notifications/unread');
        }
        return axiosInstance.get<ApiResponse<NotificationResponse>>('/api/v1/notifications', {
            params: { page, size }
        });
    }

    /**
     * Get unread notification count
     */
    static async getUnreadCount(): Promise<AxiosResponse<ApiResponse<number>>> {
        return axiosInstance.get<ApiResponse<number>>('/api/v1/notifications/unread-count');
    }

    /**
     * Mark a notification as read
     * @param id Notification ID
     */
    static async markAsRead(id: string): Promise<AxiosResponse<ApiResponse<void>>> {
        return axiosInstance.put<ApiResponse<void>>(`/api/v1/notifications/${id}/read`);
    }

    /**
     * Mark all notifications as read
     */
    static async markAllAsRead(): Promise<AxiosResponse<ApiResponse<void>>> {
        return axiosInstance.put<ApiResponse<void>>('/api/v1/notifications/read-all');
    }

    /**
     * Delete a notification
     * @param id Notification ID
     */
    static async deleteNotification(id: string): Promise<AxiosResponse<ApiResponse<void>>> {
        return axiosInstance.delete<ApiResponse<void>>(`/api/v1/notifications/${id}`);
    }

    /**
     * Get notifications for a specific order
     * @param orderId Order ID
     */
    static async getNotificationsByOrder(orderId: string): Promise<AxiosResponse<ApiResponse<Notification[]>>> {
        return axiosInstance.get<ApiResponse<Notification[]>>(`/api/v1/notifications/order/${orderId}`);
    }
}
