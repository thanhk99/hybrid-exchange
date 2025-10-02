"use client";

import React from 'react';
import { useNotification } from '@/app/components/shared/Notification';

const NotificationDemo: React.FC = () => {
  const { showInfo, showSuccess, showWarning, showError } = useNotification();

  const handleInfo = () => {
    showInfo("Thông tin", "Đây là thông báo thông tin");
  };

  const handleSuccess = () => {
    showSuccess("Thành công", "Đây là thông báo thành công");
  };

  const handleWarning = () => {
    showWarning("Cảnh báo", "Đây là thông báo cảnh báo");
  };

  const handleError = () => {
    showError("Lỗi", "Đây là thông báo lỗi");
  };

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <button 
        onClick={handleInfo}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#1890ff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Thông tin
      </button>
      
      <button 
        onClick={handleSuccess}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#52c41a', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Thành công
      </button>
      
      <button 
        onClick={handleWarning}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#faad14', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Cảnh báo
      </button>
      
      <button 
        onClick={handleError}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#ff4d4f', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Lỗi
      </button>
    </div>
  );
};

export default NotificationDemo;
