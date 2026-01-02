"use client";

import { useParams } from 'next/navigation';
import TradingChart from '@/src/components/TradeFutures/TradingChart';
import OrderBook from '@/src/components/TradeFutures/OrderBook';
import TradingForm from '@/src/components/TradeFutures/TradingForm';
import MarketInfo from '@/src/components/TradeFutures/MarketInfo';
import RecentTrades from '@/src/components/TradeFutures/RecentTrades';
import { MarketProvider } from '@/src/contexts/MarketContext';
import styles from './page.module.css';

export default function TradeSpotPage() {
    const params = useParams();
    const symbol = (params.symbol as string)?.toUpperCase() || 'BTC-USDT';

    return (
        <MarketProvider initialSymbol={symbol} marketType="spot">
            <div className={styles.container}>
                <MarketInfo symbol={symbol} isSpot={true} />

                <div className={styles.mainContent}>
                    <div className={styles.chartSection}>
                        <TradingChart symbol={symbol} isSpot={true} />
                    </div>

                    <div className={styles.marketDataSection}>
                        <div className={styles.orderBookSection}>
                            <OrderBook symbol={symbol} isSpot={true} />
                        </div>
                        <div className={styles.recentTradesSection}>
                            <RecentTrades symbol={symbol} />
                        </div>
                    </div>

                    <div className={styles.tradingFormSection}>
                        <TradingForm symbol={symbol} isSpot={true} />
                    </div>
                </div>
            </div>
        </MarketProvider>
    );
}
