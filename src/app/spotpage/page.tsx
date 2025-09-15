import { MarketSelector } from "../components/chart/marketselector/marketSelector";
import { CandleChart } from "../components/chart/candle/candleChart";

export default function ChartLayout() {
  return (
    <div>
      <MarketSelector />
      <CandleChart />
    </div>
  );
}