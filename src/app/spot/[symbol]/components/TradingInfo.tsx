'use client';
import { useState } from 'react';

interface TradingInfoProps {
  symbol: string;
  currentPrice: number;
}

const TradingInfo = ({ symbol, currentPrice }: TradingInfoProps) => {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState(currentPrice.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement trading logic
    console.log('Trading order:', { orderType, amount, price, symbol });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Giao dịch</h3>
      
      {/* Order Type Toggle */}
      <div className="flex mb-4">
        <button
          onClick={() => setOrderType('buy')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-lg transition-colors ${
            orderType === 'buy'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Mua
        </button>
        <button
          onClick={() => setOrderType('sell')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-lg transition-colors ${
            orderType === 'sell'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Bán
        </button>
      </div>

      {/* Trading Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số lượng ({symbol.replace('USDT', '')})
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="0.000001"
            min="0"
          />
        </div>

        {/* Price Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giá (USDT)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            step="0.01"
            min="0"
          />
        </div>

        {/* Total Calculation */}
        {amount && price && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tổng:</span>
              <span className="font-semibold text-gray-900">
                ${(parseFloat(amount) * parseFloat(price)).toFixed(2)} USDT
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 px-4 text-sm font-medium text-white rounded-lg transition-colors ${
            orderType === 'buy'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {orderType === 'buy' ? 'Đặt lệnh mua' : 'Đặt lệnh bán'}
        </button>
      </form>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Thao tác nhanh</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setPrice((currentPrice * 0.99).toFixed(2))}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            -1%
          </button>
          <button
            onClick={() => setPrice((currentPrice * 1.01).toFixed(2))}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            +1%
          </button>
          <button
            onClick={() => setPrice(currentPrice.toFixed(2))}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Giá thị trường
          </button>
          <button
            onClick={() => setAmount('')}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Xóa số lượng
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingInfo;
