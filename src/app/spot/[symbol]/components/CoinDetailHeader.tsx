'use client';
import { formatNumber } from '../../../utils/formatters';

interface CoinDetailHeaderProps {
  symbol: string;
  price: number;
  changePercent: number;
  volume: number;
}

const CoinDetailHeader = ({ symbol, price, changePercent, volume }: CoinDetailHeaderProps) => {
  const formatVolume = (vol: number): string => {
    if (vol >= 1000000) {
      return `${(vol / 1000000).toFixed(2)}M`;
    } else if (vol >= 1000) {
      return `${(vol / 1000).toFixed(2)}K`;
    }
    return formatNumber(vol);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {symbol.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{symbol}</h1>
            <p className="text-sm text-gray-500">Giá thời gian thực</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">
            ${formatNumber(price)}
          </div>
          <div className={`text-lg font-semibold ${
            changePercent >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {changePercent >= 0 ? '+' : ''}{formatNumber(changePercent)}%
          </div>
          <div className="text-sm text-gray-500">
            Volume: {formatVolume(volume)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetailHeader;
