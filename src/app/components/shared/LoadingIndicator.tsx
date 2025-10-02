import React from 'react';
import { ReloadOutlined } from '@ant-design/icons';

interface LoadingIndicatorProps {
  message?: string;
  className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = 'Đang cập nhật...', 
  className = '' 
}) => {
  return (
    <div className={`absolute top-2 right-2 text-xs text-gray-500 bg-white/90 px-2 py-1 rounded border border-gray-200 flex items-center gap-1 ${className}`}>
      <ReloadOutlined spin className="text-inherit" />
      <span>{message}</span>
    </div>
  );
};

export default LoadingIndicator;