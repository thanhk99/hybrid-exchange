import { MarketSelector } from "../components/chart/marketselector/marketSelector";
import { CandleChart } from "../components/chart/candle/candleChart";
import { OrderBook } from "../components/orderbook/orderbook";
import './spotpage.css'

export default function ChartLayout() {
  return (
    <div className="chart-layout">
      <div className="chart-section">
        <MarketSelector />
        <CandleChart />
      </div>
      <div className="orderbook-section">
        <OrderBook />
      </div>
      <div className="trade-section">
        <p>Place Order Form</p>
      </div>
    </div>
  );
}