"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MarketService, { MarketCoin } from '@/src/services/market';
import { StompClient } from '@/src/services/socket';
import FilterModal, { FilterOptions } from './FilterModal';
import styles from './MarketTable.module.css';
import { LeftOutlined, RightOutlined, FilterOutlined } from '@ant-design/icons';
import { formatMarketCap } from '@/src/utils/coinHelpers';
import PriceRangeChart from './PriceRangeChart';

const PAGE_SIZE = 10;

const SUPPORTED_COINS = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
    'ADAUSDT', 'DOGEUSDT', 'TRXUSDT', 'DOTUSDT', 'MATICUSDT',
    'LTCUSDT', 'BCHUSDT', 'LINKUSDT', 'XLMUSDT', 'ATOMUSDT',
    'UNIUSDT', 'AVAXUSDT', 'NEARUSDT', 'FILUSDT', 'VETUSDT',
    'ALGOUSDT', 'ICPUSDT', 'SHIBUSDT', 'TONUSDT', 'ETCUSDT',
];

export default function MarketTable() {
    const router = useRouter();
    const [markets, setMarkets] = useState<MarketCoin[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({});
    const stompClientRef = useRef<StompClient | null>(null);

    // Initial data & WebSocket connection
    useEffect(() => {
        fetchInitialData();
        connectWebSocket();
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchInitialData = async () => {
        try {
            const response = await MarketService.getMarkets();
            if (response.data && response.data.data) {
                const allMarkets = response.data.data as MarketCoin[];
                const filtered = allMarkets.filter(m => SUPPORTED_COINS.includes(m.symbol));
                const marketsToSet = filtered.length > 0 ? filtered : allMarkets;
                const sortedMarkets = marketsToSet.sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0));
                setMarkets(sortedMarkets);
            }
        } catch (e) {
            console.error('Failed to fetch markets', e);
        } finally {
            setLoading(false);
        }
    };

    const connectWebSocket = () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const wsBase = apiUrl.replace(/^http/, 'ws');
        const finalWsUrl = `${wsBase}/ws/websocket`;
        console.log('Connecting to WebSocket at:', finalWsUrl);
        const client = new StompClient(finalWsUrl);
        client.connect(() => {
            console.log('Connected to WebSocket');
            client.subscribe('/topic/spot-prices', (msg) => handlePriceUpdate(msg));
        });
        stompClientRef.current = client;
    };

    const handlePriceUpdate = (update: any) => {
        setMarkets(prev => {
            const idx = prev.findIndex(m => m.symbol === update.symbol);
            if (idx === -1) return prev;
            const coin = prev[idx];
            const updated: MarketCoin = {
                ...coin,
                id: update.id ?? coin.id,
                currentPrice: update.price ?? coin.currentPrice,
                priceChange24h: update.changePercent ?? update.percentChange ?? coin.priceChange24h,
                high24h: update.high24h ?? coin.high24h,
                low24h: update.low24h ?? coin.low24h,
                volume24h: update.volume ?? coin.volume24h,
                marketCap: update.marketCap ?? coin.marketCap,
                logoUrl: update.logoUrl ?? coin.logoUrl,
                lastUpdated: update.lastUpdated ?? coin.lastUpdated,
            };
            const copy = [...prev];
            copy[idx] = updated;
            return copy;
        });
    };

    // Filtering logic
    const filteredMarkets = markets.filter(coin => {
        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            if (!coin.symbol.toLowerCase().includes(q) && !(coin.id?.toLowerCase().includes(q))) {
                return false;
            }
        }
        // Price range
        if (filters.priceMin !== undefined && coin.currentPrice < filters.priceMin) return false;
        if (filters.priceMax !== undefined && coin.currentPrice > filters.priceMax) return false;
        // Change direction
        if (filters.changeFilter === 'positive' && coin.priceChange24h < 0) return false;
        if (filters.changeFilter === 'negative' && coin.priceChange24h >= 0) return false;
        // Market cap filter
        const marketCap = (coin as any).marketCap || 0;
        if (filters.marketCapFilter === 'large' && marketCap <= 10e9) return false;
        if (filters.marketCapFilter === 'medium' && (marketCap < 1e9 || marketCap > 10e9)) return false;
        if (filters.marketCapFilter === 'small' && marketCap >= 1e9) return false;
        return true;
    });

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filters]);

    const totalPages = Math.ceil(filteredMarkets.length / PAGE_SIZE);
    const paginatedMarkets = filteredMarkets.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const formatPrice = (price?: number | null) =>
        price === undefined || price === null
            ? '-'
            : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 6 }).format(price);

    const formatNumber = (num?: number | null) => (num === undefined || num === null ? '-' : new Intl.NumberFormat('en-US').format(num));

    const formatPercent = (p?: number | null) => {
        if (p === undefined || p === null) return '-';
        const sign = p > 0 ? '+' : '';
        return `${sign}${p.toFixed(2)}%`;
    };

    if (loading) {
        return <div className={styles.container}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Thị trường</h2>
                <div className={styles.headerActions}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc mã coin..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button className={styles.filterBtn} onClick={() => setIsFilterOpen(true)}>
                        <FilterOutlined /> Bộ lọc
                    </button>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th className={styles.desktopOnly}>Giá gần nhất</th>
                            <th className={styles.desktopOnly}>Vốn hoá thị trường</th>
                            <th className={styles.desktopOnly}>Thay đổi 24h</th>
                            <th className={styles.desktopOnly}>Phạm vi 24h</th>
                            <th className={styles.mobileOnly} style={{ textAlign: 'right' }}>Giá | Thay đổi</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedMarkets.map(coin => (
                            <tr key={coin.symbol}>
                                <td>
                                    <div className={styles.coinInfo}>
                                        {coin.logoUrl && (
                                            <img src={coin.logoUrl} alt={coin.symbol} className={styles.coinLogo} onError={e => { e.currentTarget.style.display = 'none'; }} />
                                        )}
                                        <div>
                                            <div className={styles.symbol}>{coin.symbol.replace('USDT', '')}</div>
                                            <div className={styles.name}>/ USDT</div>
                                        </div>
                                    </div>
                                </td>
                                <td className={`${styles.price} ${styles.desktopOnly}`}>{formatPrice(coin.currentPrice)}</td>
                                <td className={`${styles.price} ${styles.desktopOnly}`}>{formatMarketCap((coin as any).marketCap || 0)}</td>
                                <td className={`${Number(coin.priceChange24h) >= 0 ? styles.positive : styles.negative} ${styles.desktopOnly}`}>{formatPercent(coin.priceChange24h)}</td>
                                <td className={styles.desktopOnly}>
                                    {coin.low24h && coin.high24h ? (
                                        <PriceRangeChart low={coin.low24h} high={coin.high24h} current={coin.currentPrice} />
                                    ) : '-'}
                                </td>
                                {/* Mobile View Column */}
                                <td className={styles.mobileOnly} style={{ textAlign: 'right' }}>
                                    <div className={styles.price}>{formatPrice(coin.currentPrice)}</div>
                                    <div className={Number(coin.priceChange24h) >= 0 ? styles.positive : styles.negative} style={{ fontSize: '12px' }}>
                                        {formatPercent(coin.priceChange24h)}
                                    </div>
                                </td>
                                <td>
                                    <button className={styles.actionButton} onClick={() => router.push(`/trade/${coin.symbol}`)}>
                                        Giao dịch
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button className={styles.pageBtn} disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                        <LeftOutlined />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button key={page} className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`} onClick={() => setCurrentPage(page)}>
                            {page}
                        </button>
                    ))}
                    <button className={styles.pageBtn} disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                        <RightOutlined />
                    </button>
                </div>
            )}

            <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={setFilters} currentFilters={filters} />
        </div>
    );
}
