'use client';
import { formatNumber } from '../../../utils/formatters';

interface CryptoData {
  symbol: string;
  price: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  timestamp: number;
}

interface KlineData {
  symbol: string;
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  startTime: number;
  closeTime: number;
  interval: string;
  isClosed: boolean;
}

interface PriceInfoProps {
  data: CryptoData;
  klineData: KlineData[];
}

const PriceInfo = ({ data, klineData }: PriceInfoProps) => {
  const formatVolume = (vol: number): string => {
    if (vol >= 1000000) {
      return `${(vol / 1000000).toFixed(2)}M`;
    } else if (vol >= 1000) {
      return `${(vol / 1000).toFixed(2)}K`;
    }
    return formatNumber(vol);
  };

  const getPriceChange = () => {
    if (klineData.length < 2) return { change: 0, changePercent: 0 };
    
    const firstPrice = klineData[0].closePrice;
    const lastPrice = klineData[klineData.length - 1].closePrice;
    const change = lastPrice - firstPrice;
    const changePercent = (change / firstPrice) * 100;
    
    return { change, changePercent };
  };

  const { change, changePercent } = getPriceChange();

  const get24hStats = () => {
    if (klineData.length === 0) return { high: 0, low: 0, volume: 0 };
    
    const prices = klineData.map(k => k.highPrice);
    const volumes = klineData.map(k => k.volume);
    
    return {
      high: Math.max(...prices),
      low: Math.min(...prices),
      volume: volumes.reduce((sum, vol) => sum + vol, 0)
    };
  };

  const stats24h = get24hStats();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin giá</h3>
      
      <div className="space-y-4">
        {/* Current Price */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Giá hiện tại</span>
          <span className="text-lg font-semibold text-gray-900">
            ${formatNumber(data.price)}
          </span>
        </div>

        {/* Price Change */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Thay đổi</span>
          <div className="text-right">
            <div className={`text-sm font-semibold ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? '+' : ''}${formatNumber(Math.abs(change))}
            </div>
            <div className={`text-xs ${
              changePercent >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {changePercent >= 0 ? '+' : ''}{formatNumber(Math.abs(changePercent))}%
            </div>
          </div>
        </div>

        {/* 24h High */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">24h Cao nhất</span>
          <span className="text-sm font-semibold text-green-600">
            ${formatNumber(stats24h.high)}
          </span>
        </div>

        {/* 24h Low */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">24h Thấp nhất</span>
          <span className="text-sm font-semibold text-red-600">
            ${formatNumber(stats24h.low)}
          </span>
        </div>

        {/* Volume */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Khối lượng</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatVolume(stats24h.volume)}
          </span>
        </div>

        {/* Last Update */}
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-600">Cập nhật cuối</span>
          <span className="text-xs text-gray-500">
            {new Date(data.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Price Trend Indicator */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Xu hướng</span>
          <div className="flex items-center">
            {changePercent > 0 ? (
              <>
                <svg className="w-4 h-4 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
                <span className="text-sm font-semibold text-green-600">Tăng</span>
              </>
            ) : changePercent < 0 ? (
              <>
                <svg className="w-4 h-4 text-red-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                </svg>
                <span className="text-sm font-semibold text-red-600">Giảm</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-gray-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
                <span className="text-sm font-semibold text-gray-600">Ổn định</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceInfo;
