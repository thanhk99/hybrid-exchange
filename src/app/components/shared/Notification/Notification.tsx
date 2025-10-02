"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons';
import './Notification.css';

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface NotificationProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Hiển thị thông báo với animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Tự động ẩn thông báo
    const hideTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlined className="notification-icon success-icon" />;
      case 'warning':
        return <ExclamationCircleOutlined className="notification-icon warning-icon" />;
      case 'error':
        return <CloseCircleOutlined className="notification-icon error-icon" />;
      case 'info':
      default:
        return <InfoCircleOutlined className="notification-icon info-icon" />;
    }
  };

  return (
    <div 
      className={`notification notification-${type} ${isVisible ? 'notification-show' : ''} ${isLeaving ? 'notification-leave' : ''}`}
    >
      <div className="notification-content">
        {getIcon()}
        <div className="notification-text">
          <div className="notification-title">{title}</div>
          <div className="notification-message">{message}</div>
        </div>
        <button 
          className="notification-close" 
          onClick={handleClose}
          aria-label="Đóng thông báo"
        >
          <CloseOutlined />
        </button>
      </div>
      <div className="notification-progress">
        <div 
          className="notification-progress-bar" 
          style={{ 
            animationDuration: `${duration}ms`,
            animationDelay: '100ms'
          }}
        />
      </div>
    </div>
  );
};

export default Notification;
