import React, { useState, useEffect } from 'react';
import { EyeOutlined, EyeInvisibleOutlined, CaretDownOutlined } from '@ant-design/icons';
import { FundingService, type FundingTotalResponse } from '../../lib/api';
import { formatCurrency } from '../../utils/formatters';
import LoadingIndicator from '../shared/LoadingIndicator';
import ErrorIndicator from '../shared/ErrorIndicator';
import PnLDisplay from './PnLDisplay';
import EmptyBalanceState from './EmptyBalanceState';

interface BalanceData {
  totalValue: number;
  currency: string;
  pnlToday: number;
  pnlPercentage: number;
}

interface BalanceOverviewCardProps {
  initialBalance: BalanceData;
  onDeposit: () => void;
  onWithdraw: () => void;
  onConvert: () => void;
  onTransfer: () => void;
}

const BalanceOverviewCard: React.FC<BalanceOverviewCardProps> = ({
  initialBalance,
  onDeposit,
  onWithdraw,
  onConvert,
  onTransfer
}) => {
  const [balance, setBalance] = useState<BalanceData>(initialBalance);
  const [isHidden, setIsHidden] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchBalance = async (isRetry = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data: FundingTotalResponse = await FundingService.getFundingTotal();
      setBalance(data);
      setError(null);
      setRetryCount(0);
    } catch (error: any) {
      let errorMessage = 'Không thể tải dữ liệu số dư';
      
      if (error.response) {
        switch (error.response.status) {
          case 403:
            errorMessage = 'Không có quyền truy cập. Vui lòng đăng nhập lại.';
            break;
          case 404:
            errorMessage = 'API endpoint không tồn tại.';
            break;
          case 500:
            errorMessage = 'Lỗi server nội bộ.';
            break;
          default:
            errorMessage = `Lỗi: ${error.response.status} ${error.response.statusText}`;
        }
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến server';
      } else {
        errorMessage = error.message || 'Có lỗi xảy ra';
      }
      
      setError(errorMessage);
      console.error('Funding API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchBalance(true);
  };

  useEffect(() => {
    fetchBalance();
    // Set up periodic refresh every 30 seconds, but only if no error
    const interval = setInterval(() => {
      if (!error) {
        fetchBalance();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [error]);

  // Check if balance is empty (0 or very small amount)
  const isEmpty = balance.totalValue <= 0.001;

  // Show empty state if balance is empty and not loading
  if (isEmpty && !isLoading && !error) {
    return <EmptyBalanceState onDeposit={onDeposit} />;
  }

  return (
    <div className="bg-white rounded-md p-6 border border-gray-200 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm text-gray-600 font-normal m-0">
          Tổng giá trị ước tính
        </h2>
        <button 
          onClick={() => setIsHidden(!isHidden)}
          className="bg-transparent border-none cursor-pointer text-gray-500 p-1 rounded transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
        >
          {isHidden ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-3xl font-medium text-gray-900 transition-all duration-200 ${isHidden ? 'blur-sm select-none' : ''}`}>
            {formatCurrency(balance.totalValue)}
          </span>
          <button className="bg-transparent border-none cursor-pointer text-sm text-gray-500 flex items-center gap-1 px-2 py-1 rounded transition-all duration-200 hover:bg-gray-50 hover:text-gray-900">
            {balance.currency} <CaretDownOutlined />
          </button>
        </div>

        <PnLDisplay 
          pnlToday={balance.pnlToday}
          pnlPercentage={balance.pnlPercentage}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button 
          onClick={onDeposit}
          className="px-4 py-2 rounded-2xl text-sm cursor-pointer bg-blue-600 text-white border-none transition-all duration-200 font-medium hover:bg-blue-700"
        >
          Nạp tiền
        </button>
        <button 
          onClick={onConvert}
          className="px-4 py-2 rounded-2xl text-sm cursor-pointer bg-white border border-gray-200 text-gray-900 transition-all duration-200 font-medium hover:bg-gray-50"
        >
          Chuyển đổi
        </button>
        <button 
          onClick={onWithdraw}
          className="px-4 py-2 rounded-2xl text-sm cursor-pointer bg-white border border-gray-200 text-gray-900 transition-all duration-200 font-medium hover:bg-gray-50"
        >
          Rút tiền
        </button>
        <button 
          onClick={onTransfer}
          className="px-4 py-2 rounded-2xl text-sm cursor-pointer bg-white border border-gray-200 text-gray-900 transition-all duration-200 font-medium hover:bg-gray-50"
        >
          Chuyển tiền
        </button>
      </div>

      {isLoading && <LoadingIndicator />}

      {error && (
        <ErrorIndicator 
          error={error}
          onRetry={handleRetry}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default BalanceOverviewCard;