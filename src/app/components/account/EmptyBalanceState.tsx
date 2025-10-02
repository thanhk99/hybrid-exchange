import React from 'react';
import { WalletOutlined } from '@ant-design/icons';

interface EmptyBalanceStateProps {
  onDeposit: () => void;
  className?: string;
}

const EmptyBalanceState: React.FC<EmptyBalanceStateProps> = ({ 
  onDeposit, 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg p-8 border border-gray-200 text-center shadow-sm ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Empty wallet illustration */}
        <div className="w-32 h-32 mb-4 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1710435336131-bfcb17c3041e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHx3YWxsZXQlMjBlbXB0eSUyMGZpbmFuY2UlMjBtb25leXxlbnwwfDJ8fHwxNzU2NDczMzIyfDA&ixlib=rb-4.1.0&q=85"
            alt="Empty wallet illustration - Noman Khan on Unsplash"
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Empty state content */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Bắt đầu nạp
          </h2>
          <p className="text-sm text-gray-500 max-w-xs">
            Nạp crypto vào tài khoản.
          </p>
        </div>

        {/* Deposit button */}
        <button 
          onClick={onDeposit}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-medium text-sm transition-all duration-200 hover:bg-blue-700 flex items-center gap-2"
        >
          <WalletOutlined className="text-base" />
          Nạp tiền
        </button>
      </div>
    </div>
  );
};

export default EmptyBalanceState;