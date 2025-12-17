"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, CandlestickSeries, HistogramSeries, IChartApi, ISeriesApi, CandlestickData, HistogramData, Time } from 'lightweight-charts';
import FuturesChartService, { KlineData } from '@/src/services/futuresChart';
import { StompClient } from '@/src/services/socket';
import styles from './TradingChart.module.css';

// Define available timeframes
const timeframes = ['1s', '1m', '5m', '15m', '30m', '1h', '4h', '1d'];

interface TradingChartProps {
    symbol: string;
}

// WebSocket payload shape
interface WSKlineData {
    s: string; // Symbol
    o: number; // Open
    c: number; // Close
    h: number; // High
    l: number; // Low
    v: number; // Volume
    t: number; // Timestamp (ms)
    i: string; // Interval
}

export default function TradingChart({ symbol }: TradingChartProps) {
    // ---------- State & refs ----------
    const [timeframe, setTimeframe] = useState('1m');
    const [loading, setLoading] = useState(true);
    const [currentCandle, setCurrentCandle] = useState<{
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
        change: number;
        changePercent: number;
    } | null>(null);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
    const stompClientRef = useRef<StompClient | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const isFetchingHistoryRef = useRef(false);
    const allDataRef = useRef<KlineData[]>([]); // Store all fetched data to properly merge history
    const hasMoreHistoryRef = useRef(true);

    // Calculate expected interval in milliseconds based on timeframe
    const getIntervalMs = useCallback((tf: string): number => {
        const unit = tf.slice(-1);
        const value = parseInt(tf.slice(0, -1)) || 1;
        switch (unit) {
            case 's': return value * 1000;
            case 'm': return value * 60 * 1000;
            case 'h': return value * 60 * 60 * 1000;
            case 'd': return value * 24 * 60 * 60 * 1000;
            default: return 60 * 1000;
        }
    }, []);

    // Initialize chart with OKX-style dark theme
    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Create chart with OKX dark theme
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: '#0b0e11' },
                textColor: '#848e9c',
            },
            localization: {
                locale: 'vi-VN',
                dateFormat: 'dd/MM/yyyy',
                timeFormatter: (time: number) => {
                    const date = new Date(time * 1000);
                    return new Intl.DateTimeFormat('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        timeZone: 'Asia/Ho_Chi_Minh',
                        hour12: false
                    }).format(date);
                }
            },
            grid: {
                vertLines: { color: '#1f2329', style: 1 },
                horzLines: { color: '#1f2329', style: 1 },
            },
            crosshair: {
                mode: 1,
                vertLine: {
                    color: '#555',
                    width: 1,
                    style: 0,
                    labelBackgroundColor: '#2b2f36',
                },
                horzLine: {
                    color: '#555',
                    width: 1,
                    style: 0,
                    labelBackgroundColor: '#2b2f36',
                },
            },
            rightPriceScale: {
                borderColor: '#1f2329',
                visible: true,
                autoScale: true,
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.2,
                },
                ticksVisible: true,
            },
            timeScale: {
                borderColor: '#1f2329',
                timeVisible: true,
                secondsVisible: false,
                rightOffset: 5,
                barSpacing: 8,
                minBarSpacing: 4,
                tickMarkFormatter: (time: number, tickMarkType: any, locale: string) => {
                    const date = new Date(time * 1000);

                    const options: Intl.DateTimeFormatOptions = {
                        timeZone: 'Asia/Ho_Chi_Minh',
                        hour12: false
                    };

                    if (tickMarkType === 0) { // Year
                        options.year = 'numeric';
                    } else if (tickMarkType === 1) { // Month
                        options.month = 'short';
                        options.year = 'numeric'; // optionally
                    } else if (tickMarkType === 2) { // Day
                        options.day = 'numeric';
                        options.month = 'short';
                    } else if (tickMarkType === 3) { // Time
                        options.hour = '2-digit';
                        options.minute = '2-digit';
                    } else if (tickMarkType === 4) { // TimeWithSeconds
                        options.hour = '2-digit';
                        options.minute = '2-digit';
                        options.second = '2-digit';
                    }

                    return new Intl.DateTimeFormat('vi-VN', options).format(date);
                }
            },
            handleScroll: {
                vertTouchDrag: false,
            },
        });

        chartRef.current = chart;

        // Add candlestick series with OKX colors
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#00b96b',
            downColor: '#f6465d',
            borderUpColor: '#00b96b',
            borderDownColor: '#f6465d',
            wickUpColor: '#00b96b',
            wickDownColor: '#f6465d',
        });
        candlestickSeriesRef.current = candlestickSeries;

        // Add volume series with OKX styling
        const volumeSeries = chart.addSeries(HistogramSeries, {
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: 'volume',
        });
        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.85,
                bottom: 0,
            },
        });
        volumeSeriesRef.current = volumeSeries;

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight,
                });
            }
        };

        // Use ResizeObserver for better resize handling
        resizeObserverRef.current = new ResizeObserver(handleResize);
        resizeObserverRef.current.observe(chartContainerRef.current);

        // Initial size
        handleResize();

        return () => {
            resizeObserverRef.current?.disconnect();
            chart.remove();
            chartRef.current = null;
        };
    }, []);

    // Helper to process raw data into chart friendly format
    const processDataForChart = useCallback((rawData: KlineData[], timeframeMs: number) => {
        const candleData: CandlestickData[] = [];
        const volumeData: HistogramData[] = [];

        for (let i = 0; i < rawData.length; i++) {
            const item = rawData[i];
            const time = Math.floor(item.startTime / 1000) as Time;

            // Check if there's a gap in data (simple smoothing if needed, though usually standard candles should be precise)
            // Keeping existing logic for consistency, but improved to check previous item in array
            let useSmoothing = false;
            // logic can be simplified: just use raw values unless smoothing is strictly required by business logic
            // The previous implementation used smoothing based on time gaps, keeping it simple here:

            const open = item.openPrice;
            const close = item.closePrice;
            const high = item.highPrice;
            const low = item.lowPrice;

            candleData.push({
                time,
                open,
                high,
                low,
                close,
            });

            volumeData.push({
                time,
                value: item.volume,
                color: close >= open ? 'rgba(0, 185, 107, 0.5)' : 'rgba(246, 70, 93, 0.5)',
            });
        }
        return { candleData, volumeData };
    }, []);

    // Load history data
    const fetchHistory = useCallback(async () => {
        if (!symbol || isFetchingHistoryRef.current || !hasMoreHistoryRef.current || allDataRef.current.length === 0) return;

        console.log('Fetching history...');
        isFetchingHistoryRef.current = true;

        try {
            // Get timestamp of the oldest candle we have
            const oldestTime = allDataRef.current[0].startTime;

            // endTime should be slightly less than oldestTime to get strictly older data
            // But API might treat endTime as inclusive/exclusive. Usually it means "up to this time".
            // Let's pass oldestTime as endTime.

            const response = await FuturesChartService.getKlineData(symbol, timeframe, 500, oldestTime);

            if (response.success && response.data && response.data.length > 0) {
                // Deduplicate and merge
                const newHistory = response.data.sort((a: KlineData, b: KlineData) => a.startTime - b.startTime);

                // Filter out any overlap
                const uniqueHistory = newHistory.filter(d => d.startTime < oldestTime);

                if (uniqueHistory.length === 0) {
                    hasMoreHistoryRef.current = false;
                } else {
                    // Prepend to allData
                    allDataRef.current = [...uniqueHistory, ...allDataRef.current];

                    const intervalMs = getIntervalMs(timeframe);
                    const { candleData, volumeData } = processDataForChart(allDataRef.current, intervalMs);

                    candlestickSeriesRef.current?.setData(candleData);
                    volumeSeriesRef.current?.setData(volumeData);
                }
            } else {
                hasMoreHistoryRef.current = false;
            }
        } catch (e) {
            console.error('Failed to fetch history', e);
        } finally {
            isFetchingHistoryRef.current = false;
        }
    }, [symbol, timeframe, getIntervalMs, processDataForChart]);

    // Handle visible range change to trigger history fetch
    const onVisibleLogicalRangeChanged = useCallback((newVisibleLogicalRange: any) => {
        if (!newVisibleLogicalRange) return;

        if (newVisibleLogicalRange.from < 10 && !isFetchingHistoryRef.current && hasMoreHistoryRef.current) {
            fetchHistory();
        }
    }, [fetchHistory]);

    // Setup scroll listener
    useEffect(() => {
        if (!chartRef.current) return;

        const chart = chartRef.current;
        const timeScale = chart.timeScale();

        // Subscribe
        timeScale.subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);

        return () => {
            timeScale.unsubscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);
        };
    }, [onVisibleLogicalRangeChanged]);

    // Initial Fetch
    const fetchData = useCallback(async () => {
        if (!symbol || !candlestickSeriesRef.current || !volumeSeriesRef.current) return;
        setLoading(true);
        hasMoreHistoryRef.current = true;
        allDataRef.current = []; // Reset data store

        try {
            const response = await FuturesChartService.getKlineData(symbol, timeframe, 500);
            if (response.success && response.data) {
                // Sort by time
                const sorted = [...response.data].sort((a: KlineData, b: KlineData) => a.startTime - b.startTime);

                // Deduplicate
                const uniqueData: KlineData[] = [];
                const seenTimes = new Set<number>();
                for (let i = sorted.length - 1; i >= 0; i--) {
                    // Keep latest if dupes exist
                    const timeKey = Math.floor(sorted[i].startTime / 1000);
                    if (!seenTimes.has(timeKey)) {
                        seenTimes.add(timeKey);
                        uniqueData.unshift(sorted[i]);
                    }
                }

                allDataRef.current = uniqueData;

                const intervalMs = getIntervalMs(timeframe);
                const { candleData, volumeData } = processDataForChart(uniqueData, intervalMs);

                candlestickSeriesRef.current.setData(candleData);
                volumeSeriesRef.current.setData(volumeData);

                // Update current candle info for legend
                if (candleData.length > 0 && uniqueData.length > 0) {
                    const lastCandle = candleData[candleData.length - 1];
                    const lastVolume = uniqueData[uniqueData.length - 1].volume;
                    const change = lastCandle.close - lastCandle.open;
                    const changePercent = (change / lastCandle.open) * 100;

                    setCurrentCandle({
                        open: lastCandle.open,
                        high: lastCandle.high,
                        low: lastCandle.low,
                        close: lastCandle.close,
                        volume: lastVolume,
                        change,
                        changePercent,
                    });
                }

                // Only fit content on initial load, not subsequent history loads
                // But this IS initial load func.
                // chartRef.current?.timeScale().fitContent(); 
                // Better: set visible range to show latest candles
                chartRef.current?.timeScale().scrollToPosition(0, false); // Scroll to end
            }
        } catch (e) {
            console.error('Failed to fetch chart data', e);
        } finally {
            setLoading(false);
        }
    }, [symbol, timeframe, getIntervalMs, processDataForChart]); // processDataForChart added to deps


    // WebSocket real-time updates
    useEffect(() => {
        if (!symbol) return;

        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const wsBase = apiUrl.replace(/^http/, 'ws');
        const wsUrl = `${wsBase}/ws/websocket`;
        const client = new StompClient(wsUrl);
        stompClientRef.current = client;

        const expectedInterval = getIntervalMs(timeframe);

        client.connect(() => {
            console.log('WebSocket Connected for Chart');
            const normalized = symbol.replace(/-/g, '').toLowerCase();
            let topic = `/topic/futures/kline/${timeframe}/${normalized}`;
            if (timeframe === '1s') topic = `/topic/futures/kline/1s/${normalized}`;

            client.subscribe(topic, (msg: WSKlineData) => {
                if (!candlestickSeriesRef.current || !volumeSeriesRef.current) return;

                const time = Math.floor(msg.t / 1000) as Time;

                // Get the last candle to check for gap
                const lastCandle = candlestickSeriesRef.current.data?.()[
                    candlestickSeriesRef.current.data().length - 1
                ] as CandlestickData | undefined;

                let useSmoothing = false;
                if (lastCandle) {
                    const lastTime = (lastCandle.time as number) * 1000;
                    const timeDiff = msg.t - lastTime;
                    useSmoothing = timeDiff <= expectedInterval * 2;
                }

                const open = (lastCandle && useSmoothing) ? lastCandle.close : msg.o;
                const high = useSmoothing ? Math.max(msg.h, open) : msg.h;
                const low = useSmoothing ? Math.min(msg.l, open) : msg.l;

                // Update candle
                candlestickSeriesRef.current.update({
                    time,
                    open,
                    high,
                    low,
                    close: msg.c,
                });

                // Update volume
                volumeSeriesRef.current.update({
                    time,
                    value: msg.v,
                    color: msg.c >= open ? 'rgba(14, 203, 129, 0.5)' : 'rgba(246, 70, 93, 0.5)',
                });
            });
        });

        return () => {
            client.disconnect();
        };
    }, [symbol, timeframe, getIntervalMs]);

    // Fetch data when timeframe changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Format number with commas
    const formatPrice = (price: number) => {
        return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatVolume = (vol: number) => {
        if (vol >= 1000000) return (vol / 1000000).toFixed(2) + 'M';
        if (vol >= 1000) return (vol / 1000).toFixed(2) + 'K';
        return vol.toFixed(4);
    };

    return (
        <div className={styles.container}>
            {/* Header with symbol and timeframes */}
            <div className={styles.header}>
                <div className={styles.symbolSection}>
                    <span className={styles.symbolName}>{symbol.toUpperCase().replace('-', '/')}</span>
                    <span className={styles.symbolType}>Perpetual</span>
                </div>
                <div className={styles.timeframes}>
                    {timeframes.map((tf) => (
                        <button
                            key={tf}
                            className={`${styles.timeframeBtn} ${timeframe === tf ? styles.active : ''}`}
                            onClick={() => setTimeframe(tf)}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
                <div className={styles.chartTools}>
                    <button className={styles.toolBtn} title="Chỉ báo">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
                        </svg>
                    </button>
                    <button className={styles.toolBtn} title="Toàn màn hình">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        </svg>
                    </button>
                    <button className={styles.toolBtn} title="Cài đặt">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Chart area with OHLCV legend overlay */}
            <div className={styles.chartArea}>
                {/* OHLCV Legend */}
                {currentCandle && (
                    <div className={styles.legend}>
                        <span className={styles.legendLabel}>O</span>
                        <span className={currentCandle.close >= currentCandle.open ? styles.legendValueUp : styles.legendValueDown}>
                            {formatPrice(currentCandle.open)}
                        </span>
                        <span className={styles.legendLabel}>H</span>
                        <span className={currentCandle.close >= currentCandle.open ? styles.legendValueUp : styles.legendValueDown}>
                            {formatPrice(currentCandle.high)}
                        </span>
                        <span className={styles.legendLabel}>L</span>
                        <span className={currentCandle.close >= currentCandle.open ? styles.legendValueUp : styles.legendValueDown}>
                            {formatPrice(currentCandle.low)}
                        </span>
                        <span className={styles.legendLabel}>C</span>
                        <span className={currentCandle.close >= currentCandle.open ? styles.legendValueUp : styles.legendValueDown}>
                            {formatPrice(currentCandle.close)}
                        </span>
                        <span className={styles.legendLabel}>Vol</span>
                        <span className={styles.legendVolume}>{formatVolume(currentCandle.volume)}</span>
                        <span className={currentCandle.change >= 0 ? styles.legendChangeUp : styles.legendChangeDown}>
                            {currentCandle.change >= 0 ? '+' : ''}{formatPrice(currentCandle.change)} ({currentCandle.changePercent >= 0 ? '+' : ''}{currentCandle.changePercent.toFixed(2)}%)
                        </span>
                    </div>
                )}
                <div ref={chartContainerRef} className={styles.chartContainer} />
                {loading && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}></div>
                        <span>Đang tải...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
