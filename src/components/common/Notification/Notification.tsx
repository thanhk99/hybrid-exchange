'use client';

import { useEffect } from 'react';
import styles from './Notification.module.css';
import { NotificationProps } from '@/src/types/notification';





export const Notification: React.FC<NotificationProps> = ({
  type = 'info',
  message,
  title,
  duration = 3000,
  isVisible,
  onClose,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '💡';
    }
  };

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <div className={styles.content}>
        <span className={styles.icon}>{getIcon()}</span>
        <div className={styles.text}>
          {title && <h4 className={styles.title}>{title}</h4>}
          <p className={styles.message}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className={styles.closeButton}
        >
          ✕
        </button>
      </div>
    </div>
  );
};