'use client';
import { useEffect, useRef } from 'react';

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

interface PriceChartProps {
  data: KlineData[];
  symbol: string;
  timeframe: string;
}

const PriceChart = ({ data, symbol, timeframe }: PriceChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!data.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    if (data.length === 0) return;

    // Calculate chart dimensions
    const padding = 40;
    const chartWidth = canvas.offsetWidth - padding * 2;
    const chartHeight = canvas.offsetHeight - padding * 2;

    // Find min and max prices
    const prices = data.flatMap(d => [d.highPrice, d.lowPrice]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Draw candlesticks
    const candleWidth = chartWidth / data.length * 0.8;
    const candleSpacing = chartWidth / data.length;

    data.forEach((kline, index) => {
      const x = padding + index * candleSpacing + candleSpacing / 2;
      const isGreen = kline.closePrice >= kline.openPrice;
      
      // High-Low line
      const highY = padding + chartHeight - ((kline.highPrice - minPrice) / priceRange) * chartHeight;
      const lowY = padding + chartHeight - ((kline.lowPrice - minPrice) / priceRange) * chartHeight;
      
      ctx.strokeStyle = isGreen ? '#10b981' : '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Open-Close rectangle
      const openY = padding + chartHeight - ((kline.openPrice - minPrice) / priceRange) * chartHeight;
      const closeY = padding + chartHeight - ((kline.closePrice - minPrice) / priceRange) * chartHeight;
      
      ctx.fillStyle = isGreen ? '#10b981' : '#ef4444';
      ctx.fillRect(x - candleWidth / 2, Math.min(openY, closeY), candleWidth, Math.abs(closeY - openY));
      
      // Candle border
      ctx.strokeStyle = isGreen ? '#059669' : '#dc2626';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - candleWidth / 2, Math.min(openY, closeY), candleWidth, Math.abs(closeY - openY));
    });

    // Draw price levels
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    for (let i = 0; i <= 4; i++) {
      const price = minPrice + (priceRange * i / 4);
      const y = padding + chartHeight - (i / 4) * chartHeight;
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
      
      // Price labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`$${price.toFixed(2)}`, padding - 10, y + 4);
    }

    ctx.setLineDash([]);

  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Biểu đồ giá {symbol}
        </h3>
        <div className="text-sm text-gray-500">
          {timeframe} • {data.length} điểm dữ liệu
        </div>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-80 border border-gray-200 rounded"
          style={{ width: '100%', height: '320px' }}
        />
        
        {data.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <div className="text-lg mb-2">📊</div>
              <div>Đang chờ dữ liệu...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceChart;
