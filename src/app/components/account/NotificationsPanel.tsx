import React from 'react';
import { RightOutlined } from '@ant-design/icons';
import styles from './NotificationsPanel.module.css';

interface NotificationItem {
  date: string;
  title: string;
}

interface NotificationsPanelProps {
  notifications: NotificationItem[];
  onViewMore?: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onViewMore
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Thông báo</h2>
        <button 
          onClick={onViewMore}
          className={styles.viewMoreButton}
        >
          Thêm <RightOutlined />
        </button>
      </div>

      <div className={styles.notificationsList}>
        {notifications.map((notification, index) => (
          <div key={index} className={styles.notificationItem}>
            <div className={styles.notificationDate}>
              {notification.date}
            </div>
            <div className={styles.notificationContent}>
              <p className={styles.notificationTitle}>
                {notification.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPanel;