import React from 'react';
import { ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';

interface ErrorIndicatorProps {
  error: string;
  onRetry: () => void;
  isLoading?: boolean;
  className?: string;
}

const ErrorIndicator: React.FC<ErrorIndicatorProps> = ({ 
  error, 
  onRetry, 
  isLoading = false,
  className = '' 
}) => {
  return (
    <div className={`absolute top-2 right-2 bg-red-50 border border-red-200 rounded-sm p-2 max-w-70 z-10 ${className}`}>
      <div className="flex items-start gap-1 text-xs text-red-600 mb-1 leading-tight">
        <ExclamationCircleOutlined className="text-sm mt-0.5 flex-shrink-0 text-red-600" />
        <span>{error}</span>
      </div>
      <button 
        onClick={onRetry}
        className="bg-red-600 text-white border-none rounded px-2 py-1 text-xs cursor-pointer flex items-center gap-1 transition-all duration-200 w-full justify-center hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        <ReloadOutlined className="text-inherit" />
        <span>Thử lại</span>
      </button>
    </div>
  );
};

export default ErrorIndicator;