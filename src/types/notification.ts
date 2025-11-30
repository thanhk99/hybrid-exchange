// Toast notification props (for temporary notifications)
export interface NotificationProps {
  type?: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  isVisible: boolean;
  onClose: () => void;
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// Persistent notification entity
export interface Notification {
  id: string;
  userId?: string;
  type: NotificationCategory;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
  link?: string;
}

export type NotificationCategory =
  | 'TRADE'
  | 'PAYMENT'
  | 'SYSTEM'
  | 'SECURITY'
  | 'PROMOTION'
  | 'P2P_ORDER_CREATED'; // Added based on backend data

export interface NotificationResponse {
  content: Notification[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  numberOfElements?: number;
  first?: boolean;
  empty?: boolean;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}