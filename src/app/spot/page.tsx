'use client';
import { useEffect, useState } from 'react';
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Real-time Crypto Prices</h1>
        
        {/* Connection Status - removed per request */}

        {/* Crypto Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    24h Change
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    24h High
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    24h Low
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Update
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.values(cryptoData).length > 0 ? (
                  Object.values(cryptoData)
                    .sort((a, b) => a.symbol.localeCompare(b.symbol))
                    .map((crypto: CryptoData) => (
                      <tr key={crypto.symbol} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {crypto.symbol}
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
                        {isConnected ? 'Waiting for data...' : 'Connecting to WebSocket...'}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Debug Info removed per request */}
      </div>
    </div>
  );
};

export default CryptoPage;