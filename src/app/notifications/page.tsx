'use client';

import React from 'react';
import NotificationList from '../../components/Notification/NotificationList/NotificationList';
import './page.css';

export default function NotificationsPage() {
    return (
        <div className="notifications-page">
            <div className="notifications-page-container">
                <NotificationList />
            </div>
        </div>
    );
}
