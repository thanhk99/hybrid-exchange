export interface NotificationProps {
  type?: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  isVisible: boolean;
  onClose: () => void;
}
export type NotificationType = 'success' | 'error' | 'warning' | 'info';