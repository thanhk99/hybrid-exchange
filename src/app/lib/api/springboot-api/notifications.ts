import axiosInstance from "../axios";
import { API_CONFIG } from "../../constants";

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface NotificationResponse {
  items: NotificationItem[];
  total: number;
  unreadCount: number;
  page: number;
  totalPages: number;
}

class NotificationService {
  static apiNotificationsList: string = API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST;
  static apiMarkAsRead: string = API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_READ;

  /**
   * Lấy danh sách thông báo
   */
  static async getNotifications(
    page: number = 1, 
    limit: number = 10, 
    type?: string
  ): Promise<NotificationResponse> {
    try {
      let url = `${this.apiNotificationsList}?page=${page}&limit=${limit}`;
      if (type) {
        url += `&type=${type}`;
      }
      
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Lấy thông báo chưa đọc
   */
  static async getUnreadNotifications(): Promise<NotificationItem[]> {
    try {
      const response = await axiosInstance.get(`${this.apiNotificationsList}?unread=true`);
      return response.data.items;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  }

  /**
   * Đánh dấu thông báo đã đọc
   */
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      await axiosInstance.post(`${this.apiMarkAsRead}/${notificationId}`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  static async markAllAsRead(): Promise<void> {
    try {
      await axiosInstance.post(`${this.apiMarkAsRead}/all`);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  static async getUnreadCount(): Promise<number> {
    try {
      const response = await axiosInstance.get(`${this.apiNotificationsList}/unread-count`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }
}

export default NotificationService;