'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useWebSocket from '../lib/hooks/useWebSocket';

interface CryptoData {
  symbol: string;
  price: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  timestamp: number;
}

const CryptoPage = () => {
  const router = useRouter();
  const { isConnected, error, lastMessage } = useWebSocket('/topic/spot-prices');
  const [cryptoData, setCryptoData] = useState<Record<string, CryptoData>>({});

  // Xử lý dữ liệu nhận được từ WebSocket
  useEffect(() => {
    if (lastMessage) {
      try {
        const data: CryptoData = lastMessage;
        setCryptoData(prev => ({
          ...prev,
          [data.symbol]: data
        }));
      } catch (e) {
        console.error('Error processing message:', e);
      }
    }
  }, [lastMessage]);

  // Format số
  const formatNumber = (num: number, decimalPlaces: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    }).format(num);
  };

  // Format volume lớn
  const formatVolume = (volume: number): string => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}K`;
    }
    return formatNumber(volume);
  };

  // Xử lý click vào coin để xem chi tiết
  const handleCoinClick = (symbol: string) => {
    router.push(`/spot/${symbol.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Giá Crypto Thời Gian Thực</h1>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Đã kết nối' : 'Đang kết nối...'}
            </span>
          </div>
        </div>
        
        {/* Crypto Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coin
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thay đổi 24h
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cao nhất 24h
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thấp nhất 24h
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khối lượng
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cập nhật cuối
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.values(cryptoData).length > 0 ? (
                  Object.values(cryptoData)
                    .sort((a, b) => a.symbol.localeCompare(b.symbol))
                    .map((crypto: CryptoData) => (
                      <tr 
                        key={crypto.symbol} 
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleCoinClick(crypto.symbol)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white font-bold text-xs">
                                {crypto.symbol.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {crypto.symbol}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-bold text-blue-600">
                            ${formatNumber(crypto.price)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className={`text-sm font-bold ${
                            crypto.changePercent >= 0 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {crypto.changePercent >= 0 ? '+' : ''}{formatNumber(crypto.changePercent)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900">
                            ${formatNumber(crypto.high24h)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900">
                            ${formatNumber(crypto.low24h)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900">
                            {formatVolume(crypto.volume)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-500">
                            {new Date(crypto.timestamp).toLocaleTimeString()}
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="text-gray-500 text-sm">
                        {isConnected ? 'Đang chờ dữ liệu...' : 'Đang kết nối WebSocket...'}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Hướng dẫn sử dụng
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>• Nhấp vào bất kỳ coin nào để xem thông tin chi tiết và biểu đồ giá</p>
                <p>• Dữ liệu được cập nhật theo thời gian thực từ WebSocket</p>
                <p>• Trang chi tiết sẽ hiển thị biểu đồ kline và thông tin giao dịch</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoPage;