"use client";

import { useParams } from 'next/navigation';
import TradingChart from '@/src/components/TradeFutures/TradingChart';
import OrderBook from '@/src/components/TradeFutures/OrderBook';
import TradingForm from '@/src/components/TradeFutures/TradingForm';
import MarketInfo from '@/src/components/TradeFutures/MarketInfo';
import PositionsPanel from '@/src/components/TradeFutures/PositionsPanel';
import { FuturesMarketProvider } from '@/src/contexts/FuturesMarketContext';
import styles from './page.module.css';

export default function TradeFuturesPage() {
    const params = useParams();
    const symbol = (params.symbol as string)?.toUpperCase() || 'BTC-USDT';

    return (
        <FuturesMarketProvider initialSymbol={symbol}>
            <div className={styles.container}>
                <MarketInfo symbol={symbol} />

                <div className={styles.mainContent}>
                    <div className={styles.chartSection}>
                        <TradingChart symbol={symbol} />
                    </div>

                    <div className={styles.orderBookSection}>
                        <OrderBook symbol={symbol} />
                    </div>
                    <div className={styles.tradingFormSection}>
                        <TradingForm symbol={symbol} />
                    </div>
                </div>

                <div className={styles.bottomPanel}>
                    <PositionsPanel />
                </div>
            </div>
        </FuturesMarketProvider>
    );
}
