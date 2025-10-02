"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Notification, { NotificationType, NotificationProps } from './Notification';

interface NotificationContextType {
  showNotification: (type: NotificationType, title: string, message: string, duration?: number) => void;
  showInfo: (title: string, message: string, duration?: number) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showWarning: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showNotification = useCallback((
    type: NotificationType, 
    title: string, 
    message: string, 
    duration: number = 5000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: NotificationProps = {
      id,
      type,
      title,
      message,
      duration,
      onClose: () => removeNotification(id)
    };

    setNotifications(prev => [...prev, newNotification]);
  }, [removeNotification]);

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    showNotification('info', title, message, duration);
  }, [showNotification]);

  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    showNotification('success', title, message, duration);
  }, [showNotification]);

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    showNotification('warning', title, message, duration);
  }, [showNotification]);

  const showError = useCallback((title: string, message: string, duration?: number) => {
    showNotification('error', title, message, duration);
  }, [showNotification]);

  const contextValue: NotificationContextType = {
    showNotification,
    showInfo,
    showSuccess,
    showWarning,
    showError,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <div className="notification-container">
        {notifications.map(notification => (
          <Notification key={notification.id} {...notification} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
