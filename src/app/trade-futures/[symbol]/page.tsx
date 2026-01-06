"use client";

import { useParams } from 'next/navigation';
import TradingView from '@/src/components/TradeFutures/TradingView';
import OrderBook from '@/src/components/TradeFutures/OrderBook';
import TradingForm from '@/src/components/TradeFutures/TradingForm';
import MarketInfo from '@/src/components/TradeFutures/MarketInfo';
import PositionsPanel from '@/src/components/TradeFutures/PositionsPanel';
import RecentTrades from '@/src/components/TradeFutures/RecentTrades';
import { MarketProvider } from '@/src/contexts/MarketContext';
import styles from './page.module.css';

export default function TradeFuturesPage() {
    const params = useParams();
    const symbol = (params.symbol as string)?.toUpperCase() || 'BTC-USDT';

    return (
        <MarketProvider initialSymbol={symbol} marketType="futures">
            <div className={styles.container}>
                <MarketInfo symbol={symbol} />

                <div className={styles.mainContent}>
                    <div className={styles.chartSection}>
                        <TradingView symbol={symbol} isSpot={false} />
                    </div>

                    <div className={styles.marketDataSection}>
                        <div className={styles.orderBookSection}>
                            <OrderBook symbol={symbol} />
                        </div>
                        <div className={styles.recentTradesSection}>
                            <RecentTrades symbol={symbol} />
                        </div>
                    </div>

                    <div className={styles.tradingFormSection}>
                        <TradingForm symbol={symbol} />
                    </div>
                </div>

                <div className={styles.bottomPanelRoot}>
                    <PositionsPanel />
                </div>
            </div>
        </MarketProvider>
    );
}
