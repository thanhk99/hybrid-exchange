import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
  className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = 'Đang tải...', 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div className="text-gray-600 text-sm">{message}</div>
      </div>
    </div>
  );
};

export default LoadingIndicator;