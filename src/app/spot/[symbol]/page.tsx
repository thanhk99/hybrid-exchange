'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useWebSocket from '../../lib/hooks/useWebSocket';
import CoinDetailHeader from './components/CoinDetailHeader';
import PriceChart from './components/PriceChart';
import PriceInfo from './components/PriceInfo';
import TradingInfo from './components/TradingInfo';
import LoadingIndicator from '../../components/shared/LoadingIndicator';

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

interface CryptoData {
  symbol: string;
  price: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  timestamp: number;
}

const CoinDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const symbol = params.symbol as string;
  
  const { isConnected, error, lastMessage } = useWebSocket('/topic/kline-data');
  const [klineData, setKlineData] = useState<KlineData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<CryptoData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1s');

  // Xử lý dữ liệu kline từ WebSocket
  useEffect(() => {
    if (lastMessage && lastMessage.symbol === symbol.toUpperCase()) {
      const kline: KlineData = {
        symbol: lastMessage.symbol,
        openPrice: parseFloat(lastMessage.openPrice),
        closePrice: parseFloat(lastMessage.closePrice),
        highPrice: parseFloat(lastMessage.highPrice),
        lowPrice: parseFloat(lastMessage.lowPrice),
        volume: parseFloat(lastMessage.volume),
        startTime: lastMessage.startTime,
        closeTime: lastMessage.closeTime,
        interval: lastMessage.interval,
        isClosed: lastMessage.isClosed
      };

      setKlineData(prev => {
        const newData = [...prev, kline];
        // Giữ lại tối đa 100 điểm dữ liệu gần nhất
        return newData.slice(-100);
      });

      // Cập nhật giá hiện tại
      setCurrentPrice({
        symbol: lastMessage.symbol,
        price: parseFloat(lastMessage.closePrice),
        changePercent: 0, // Sẽ tính toán từ dữ liệu lịch sử
        high24h: parseFloat(lastMessage.highPrice),
        low24h: parseFloat(lastMessage.lowPrice),
        volume: parseFloat(lastMessage.volume),
        timestamp: lastMessage.closeTime
      });
    }
  }, [lastMessage, symbol]);

  // Tính toán phần trăm thay đổi
  useEffect(() => {
    if (klineData.length > 1 && currentPrice) {
      const firstPrice = klineData[0].closePrice;
      const changePercent = ((currentPrice.price - firstPrice) / firstPrice) * 100;
      
      setCurrentPrice(prev => prev ? {
        ...prev,
        changePercent
      } : null);
    }
  }, [klineData, currentPrice]);

  const timeframes = [
    { value: '1s', label: '1s' },
    { value: '1m', label: '1m' },
    { value: '5m', label: '5m' },
    { value: '15m', label: '15m' },
    { value: '1h', label: '1h' },
    { value: '4h', label: '4h' },
    { value: '1d', label: '1d' }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi kết nối</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Chi tiết {symbol?.toUpperCase()}
            </h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Coin Detail Header */}
        {currentPrice && (
          <CoinDetailHeader 
            symbol={symbol}
            price={currentPrice.price}
            changePercent={currentPrice.changePercent}
            volume={currentPrice.volume}
          />
        )}

        {/* Timeframe Selector */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Khung thời gian:</span>
            <div className="flex space-x-1">
              {timeframes.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setSelectedTimeframe(tf.value)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedTimeframe === tf.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2">
            <PriceChart 
              data={klineData}
              symbol={symbol}
              timeframe={selectedTimeframe}
            />
          </div>

          {/* Price Info */}
          <div className="space-y-6">
            {currentPrice && (
              <PriceInfo 
                data={currentPrice}
                klineData={klineData}
              />
            )}
            
            <TradingInfo 
              symbol={symbol}
              currentPrice={currentPrice?.price || 0}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin giao dịch</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Giá mở</div>
              <div className="text-lg font-semibold text-gray-900">
                ${klineData.length > 0 ? klineData[klineData.length - 1].openPrice.toFixed(2) : '0.00'}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Giá cao nhất</div>
              <div className="text-lg font-semibold text-green-600">
                ${klineData.length > 0 ? Math.max(...klineData.map(k => k.highPrice)).toFixed(2) : '0.00'}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Giá thấp nhất</div>
              <div className="text-lg font-semibold text-red-600">
                ${klineData.length > 0 ? Math.min(...klineData.map(k => k.lowPrice)).toFixed(2) : '0.00'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetailPage;
