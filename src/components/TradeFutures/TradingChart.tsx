"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, CandlestickSeries, HistogramSeries, LineSeries, IChartApi, ISeriesApi, CandlestickData, HistogramData, Time } from 'lightweight-charts';
import FuturesChartService, { KlineData } from '@/src/services/futuresChart';
import SpotChartService, { KlineData as SpotKlineData } from '@/src/services/spotChart';
// Removed useMarket from MarketContext to avoid re-renders
// import { useMarket } from '@/src/contexts/MarketContext';
import { StompClient } from '@/src/services/socket';
import { formatTopicSymbol } from '@/src/utils/coinHelpers';
import {
    LineOutlined,
    HighlightOutlined,
    BarChartOutlined,
    ExpandOutlined,
    SettingOutlined,
    EyeOutlined,
    DeleteOutlined,
    AimOutlined,
    FunctionOutlined,
    ArrowsAltOutlined,
    NodeIndexOutlined,
    DotChartOutlined,
    BlockOutlined,
    EditOutlined,
    FontSizeOutlined,
    ColumnHeightOutlined,
    AreaChartOutlined
} from '@ant-design/icons';
import { Dropdown, Menu, Tooltip, Divider } from 'antd';
import styles from './TradingChart.module.css';
import {
    DrawingPrimitive,
    TrendLine,
    HorizontalLine,
    VerticalLine,
    Rectangle,
    FibonacciRetracement,
    MultiPointDrawing,
    TextDrawing,
    BrushDrawing,
    MeasurementDrawing,
    DrawingPoint
} from './drawings';

// Define available timeframes
const timeframes = ['1s', '1m', '5m', '15m', '30m', '1h', '4h', '1d'];

interface TradingChartProps {
    symbol: string;
    isSpot?: boolean;
}

// WebSocket payload shape
interface WSKlineData {
    symbol: string;
    openPrice: string | number;
    closePrice: string | number;
    highPrice: string | number;
    lowPrice: string | number;
    volume: string | number;
    startTime: number;
    closeTime: number;
    interval: string;
    closed: boolean;
}

export default function TradingChart({ symbol, isSpot = false }: TradingChartProps) {
    // ---------- State & refs ----------
    const [timeframe, setTimeframe] = useState('1m');
    const [loading, setLoading] = useState(true);
    const [activeIndicators, setActiveIndicators] = useState<string[]>(['MA7', 'MA25']);
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [drawings, setDrawings] = useState<DrawingPrimitive[]>([]);
    const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartPos, setDragStartPos] = useState<{ time: number, price: number, logical: number } | null>(null);
    const [dragInitialPoints, setDragInitialPoints] = useState<DrawingPoint[] | null>(null);
    const [isHoveringDrawing, setIsHoveringDrawing] = useState(false);
    const drawingsRef = useRef<DrawingPrimitive[]>([]);
    const [currentDrawing, setCurrentDrawing] = useState<DrawingPrimitive | null>(null);
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
    const ma7SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
    const ma25SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
    const ma99SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stompClientRef = useRef<StompClient | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const isFetchingHistoryRef = useRef(false);
    const allDataRef = useRef<(KlineData | SpotKlineData)[]>([]);
    const hasMoreHistoryRef = useRef(true);

    // Sync drawingsRef with state
    useEffect(() => {
        drawingsRef.current = drawings;
    }, [drawings]);

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
            priceFormat: { type: 'volume' },
            priceScaleId: 'volume',
        });
        volumeSeries.priceScale().applyOptions({
            scaleMargins: { top: 0.85, bottom: 0 },
        });
        volumeSeriesRef.current = volumeSeries;

        // Add MA Series
        ma7SeriesRef.current = chart.addSeries(LineSeries, { color: '#f0b90b', lineWidth: 1, crosshairMarkerVisible: false, lastValueVisible: false });
        ma25SeriesRef.current = chart.addSeries(LineSeries, { color: '#e443ff', lineWidth: 1, crosshairMarkerVisible: false, lastValueVisible: false });
        ma99SeriesRef.current = chart.addSeries(LineSeries, { color: '#4a76ff', lineWidth: 1, crosshairMarkerVisible: false, lastValueVisible: false });

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                const width = chartContainerRef.current.clientWidth;
                const height = chartContainerRef.current.clientHeight;

                chartRef.current.applyOptions({ width, height });

                // Sync canvas size
                if (canvasRef.current) {
                    canvasRef.current.width = width;
                    canvasRef.current.height = height;
                    requestAnimationFrame(drawAll);
                }
            }
        };

        // Use ResizeObserver for better resize handling
        resizeObserverRef.current = new ResizeObserver(handleResize);
        resizeObserverRef.current.observe(chartContainerRef.current);

        // Initial size
        handleResize();

        // Subscibe to crosshair and visible range changes to redraw canvas
        chart.subscribeCrosshairMove((param) => {
            requestAnimationFrame(drawAll);

            // Handle hover detection
            if (param.point && candlestickSeriesRef.current) {
                const x = param.point.x;
                const y = param.point.y;

                let isAnyHit = false;
                // Use Ref to avoid closure stale state
                for (const drawing of drawingsRef.current) {
                    if (drawing.hitTest(x, y, chart, candlestickSeriesRef.current)) {
                        isAnyHit = true;
                        break;
                    }
                }
                setIsHoveringDrawing(isAnyHit);
            } else {
                setIsHoveringDrawing(false);
            }
        });
        chart.timeScale().subscribeVisibleLogicalRangeChange(() => {
            requestAnimationFrame(drawAll);
        });

        return () => {
            resizeObserverRef.current?.disconnect();
            chart.remove();
            chartRef.current = null;
        };
    }, []);

    // Helper to process raw data into chart friendly format
    const processDataForChart = useCallback((rawData: (KlineData | SpotKlineData)[], timeframeMs: number) => {
        const candleData: CandlestickData[] = [];
        const volumeData: HistogramData[] = [];
        const ma7Data: any[] = [];
        const ma25Data: any[] = [];
        const ma99Data: any[] = [];

        for (let i = 0; i < rawData.length; i++) {
            const item = rawData[i];
            let time: Time;
            let open: number;
            let close: number;
            let high: number;
            let low: number;

            // Type guard to distinguish between Futures and Spot data
            if ('openPrice' in item) {
                // Futures Data
                time = Math.floor(item.startTime / 1000) as Time;
                open = Number(item.openPrice);
                close = Number(item.closePrice);
                high = Number(item.highPrice);
                low = Number(item.lowPrice);
            } else {
                // Spot Data
                time = Math.floor(item.time) as Time;
                open = Number(item.open);
                close = Number(item.close);
                high = Number(item.high);
                low = Number(item.low);
            }

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
                color: close >= open ? 'rgba(0, 185, 107, 0.4)' : 'rgba(246, 70, 93, 0.4)',
            });

            // Calculate MAs (Simple implementation)
            const getItemClose = (item: KlineData | SpotKlineData) => {
                if ('closePrice' in item) return Number(item.closePrice);
                return Number(item.close);
            };

            if (i >= 6) {
                const sum = rawData.slice(i - 6, i + 1).reduce((a, b) => a + getItemClose(b), 0);
                ma7Data.push({ time, value: sum / 7 });
            }
            if (i >= 24) {
                const sum = rawData.slice(i - 24, i + 1).reduce((a, b) => a + getItemClose(b), 0);
                ma25Data.push({ time, value: sum / 25 });
            }
            if (i >= 98) {
                const sum = rawData.slice(i - 98, i + 1).reduce((a, b) => a + getItemClose(b), 0);
                ma99Data.push({ time, value: sum / 99 });
            }
        }
        return { candleData, volumeData, ma7Data, ma25Data, ma99Data };
    }, []);

    // Load history data
    const fetchHistory = useCallback(async () => {
        if (!symbol || isFetchingHistoryRef.current || !hasMoreHistoryRef.current || allDataRef.current.length === 0) return;

        console.log('Fetching history...');
        isFetchingHistoryRef.current = true;

        try {
            const getItemTime = (item: KlineData | SpotKlineData) => {
                if ('startTime' in item) return item.startTime;
                return (item as any).time * 1000;
            }

            const oldestTime = getItemTime(allDataRef.current[0]);

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
                    const { candleData, volumeData, ma7Data, ma25Data, ma99Data } = processDataForChart(allDataRef.current, intervalMs);

                    candlestickSeriesRef.current?.setData(candleData);
                    volumeSeriesRef.current?.setData(volumeData);

                    // Update MAs in history as well
                    ma7SeriesRef.current?.setData(activeIndicators.includes('MA7') ? ma7Data : []);
                    ma25SeriesRef.current?.setData(activeIndicators.includes('MA25') ? ma25Data : []);
                    ma99SeriesRef.current?.setData(activeIndicators.includes('MA99') ? ma99Data : []);
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
            const normalizedSymbol = symbol.replace(/-/g, '').toUpperCase();
            let data: (KlineData | SpotKlineData)[];
            if (isSpot) {
                if (timeframe === '1s') {
                    // Use realtime endpoint for 1s data (RingBuffer)
                    const response = await SpotChartService.getRealtimeKlineData(normalizedSymbol);
                    data = response.data || [];
                } else {
                    const response = await SpotChartService.getKlineData({
                        symbol: normalizedSymbol,
                        interval: timeframe
                    });
                    data = response.data || [];
                }
            } else {
                const response = await FuturesChartService.getKlineData(normalizedSymbol, timeframe, 500);
                data = response.data || [];
            }

            if (data) {
                // Sort by time
                const sorted = [...data].sort((a: any, b: any) => {
                    const timeA = a.startTime !== undefined ? a.startTime : a.time * 1000;
                    const timeB = b.startTime !== undefined ? b.startTime : b.time * 1000;
                    return timeA - timeB;
                });

                // Deduplicate
                const uniqueData: (KlineData | SpotKlineData)[] = [];
                const seenTimes = new Set<number>();
                for (let i = sorted.length - 1; i >= 0; i--) {
                    // Keep latest if dupes exist
                    const item = sorted[i];
                    const startTime = (item as any).startTime !== undefined ? (item as any).startTime : (item as any).time * 1000;
                    const timeKey = Math.floor(startTime / 1000);
                    if (!seenTimes.has(timeKey)) {
                        seenTimes.add(timeKey);
                        uniqueData.unshift(item);
                    }
                }

                allDataRef.current = uniqueData;

                const intervalMs = getIntervalMs(timeframe);
                const { candleData, volumeData, ma7Data, ma25Data, ma99Data } = processDataForChart(uniqueData, intervalMs);

                candlestickSeriesRef.current.setData(candleData);
                volumeSeriesRef.current.setData(volumeData);

                // Set MA data based on state
                ma7SeriesRef.current?.setData(activeIndicators.includes('MA7') ? ma7Data : []);
                ma25SeriesRef.current?.setData(activeIndicators.includes('MA25') ? ma25Data : []);
                ma99SeriesRef.current?.setData(activeIndicators.includes('MA99') ? ma99Data : []);

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

                chartRef.current?.timeScale().scrollToPosition(0, false);
            }
        } catch (e) {
            console.error('Failed to fetch chart data', e);
        } finally {
            setLoading(false);
        }
    }, [symbol, timeframe, getIntervalMs, processDataForChart, activeIndicators]);


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
            const topic = `/topic/kline-data`;

            client.subscribe(topic, (msg: WSKlineData) => {
                if (!candlestickSeriesRef.current || !volumeSeriesRef.current) return;

                // Filter by symbol and interval
                // Filter by symbol
                const msgSymbol = msg.symbol.replace(/-/g, '').toUpperCase();
                const currentSymbolNormalized = symbol.replace(/-/g, '').toUpperCase();

                if (msgSymbol !== currentSymbolNormalized) {
                    return;
                }

                // If socket sends specific interval data matching our timeframe, use it directly (if backend supports it)
                // If socket sends 1s data ('1s' or '1m' but usually '1s' from documentation), we aggregate it.
                // Assuming /topic/kline-data is 1s stream as per docs.

                const expectedInterval = getIntervalMs(timeframe);
                const msgStartTime = Number(msg.startTime);
                // Align start time to our timeframe bucket
                const alignedStartTime = Math.floor(msgStartTime / expectedInterval) * expectedInterval;

                const time = Math.floor(alignedStartTime / 1000) as Time;

                const open = msg.openPrice !== undefined ? Number(msg.openPrice) : Number((msg as any).open);
                const close = msg.closePrice !== undefined ? Number(msg.closePrice) : Number((msg as any).close);
                const high = msg.highPrice !== undefined ? Number(msg.highPrice) : Number((msg as any).high);
                const low = msg.lowPrice !== undefined ? Number(msg.lowPrice) : Number((msg as any).low);
                const volume = Number(msg.volume);

                // Get the last candle from the chart to aggregate or append
                const data = candlestickSeriesRef.current.data();
                const lastCandle = data.length > 0 ? data[data.length - 1] as CandlestickData : undefined;

                if (!lastCandle) return;

                const lastCandleTime = lastCandle.time as number;

                if (time === lastCandleTime) {
                    // Update current candle (Aggregate)
                    candlestickSeriesRef.current.update({
                        time,
                        open: lastCandle.open, // Open price of larger timeframe doesn't change
                        high: Math.max(lastCandle.high, high),
                        low: Math.min(lastCandle.low, low),
                        close: close,
                    });

                    const volData = volumeSeriesRef.current.data();
                    const lastVolBar = volData.length > 0 ? volData[volData.length - 1] as HistogramData : undefined;

                    if (lastVolBar && (lastVolBar.time as number) === time) {
                        volumeSeriesRef.current.update({
                            time,
                            value: lastVolBar.value + volume, // Accumulate
                            color: close >= lastCandle.open ? 'rgba(14, 203, 129, 0.5)' : 'rgba(246, 70, 93, 0.5)',
                        });
                    }
                } else if ((time as number) > lastCandleTime) {
                    // New candle started
                    candlestickSeriesRef.current.update({
                        time,
                        open: open, // Open of the first 1s is Open of the new 1m
                        high: high,
                        low: low,
                        close: close,
                    });

                    volumeSeriesRef.current.update({
                        time,
                        value: volume,
                        color: close >= open ? 'rgba(14, 203, 129, 0.5)' : 'rgba(246, 70, 93, 0.5)',
                    });
                }
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

    // ---------- Drawing Logic ----------
    const createDrawingTool = (toolType: string): DrawingPrimitive | null => {
        console.log('[Drawing] Instantiating tool:', toolType);
        switch (toolType) {
            case 'line':
            case 'ray':
                return new TrendLine();
            case 'h-line':
                return new HorizontalLine();
            case 'v-line':
                return new VerticalLine();
            case 'rect':
                return new Rectangle();
            case 'fib':
                return new FibonacciRetracement();
            case 'xabcd':
                return new MultiPointDrawing(5, ['X', 'A', 'B', 'C', 'D']);
            case 'cypher':
                return new MultiPointDrawing(5, ['X', 'A', 'B', 'C', 'D']);
            case 'head-shoulders':
                return new MultiPointDrawing(7, ['L-S', 'N1', 'H', 'N2', 'R-S']);
            case 'abcd':
                return new MultiPointDrawing(4, ['A', 'B', 'C', 'D']);
            case 'triangle':
                return new MultiPointDrawing(4, ['A', 'B', 'C', 'D']);
            case 'elliott-impulse':
                return new MultiPointDrawing(6, ['(0)', '(1)', '(2)', '(3)', '(4)', '(5)']);
            case 'elliott-abc':
                return new MultiPointDrawing(4, ['(0)', '(A)', '(B)', '(C)']);
            case 'fib':
            case 'fib-ext':
                return new FibonacciRetracement();
            case 'brush':
                return new BrushDrawing();
            case 'circle':
                return new MultiPointDrawing(2, ['O', 'R']);
            case 'rect':
                return new Rectangle();
            case 'text':
            case 'callout':
                return new TextDrawing(toolType === 'text' ? 'Văn bản' : 'Chú thích');
            case 'price-range':
                return new MeasurementDrawing('price');
            case 'time-range':
                return new MeasurementDrawing('time');
            default:
                console.warn('[Drawing] No class for tool type:', toolType);
                return null;
        }
    };

    const [isCanvasEventsEnabled, setIsCanvasEventsEnabled] = useState(true);

    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        console.log('[Drawing] Mouse down, activeTool:', activeTool);

        if (!chartRef.current || !candlestickSeriesRef.current || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (activeTool === 'cursor' || !activeTool) {
            // Hit test logic
            let hit = false;
            const newDrawings = [...drawings];

            // Loop backwards to hit the topmost drawing first
            for (let i = newDrawings.length - 1; i >= 0; i--) {
                const drawing = newDrawings[i];
                if (!hit && drawing.hitTest(x, y, chartRef.current, candlestickSeriesRef.current)) {
                    drawing.setSelected(true);
                    setSelectedDrawingId(drawing.getId());

                    // Start dragging
                    const time = chartRef.current.timeScale().coordinateToTime(x);
                    const price = candlestickSeriesRef.current.coordinateToPrice(y);
                    const logical = chartRef.current.timeScale().coordinateToLogical(x);

                    if (price !== null && logical !== null) {
                        setIsDragging(true);
                        setDragStartPos({
                            time: time ? Number(time) : 0,
                            price,
                            logical
                        });
                        setDragInitialPoints([...drawing.getPoints()]);
                        console.log('[Drawing] Start dragging:', drawing.getId());
                    }

                    hit = true;
                } else {
                    drawing.setSelected(false);
                }
            }

            if (!hit) {
                console.log('[Drawing] No hit, allowing chart interaction');
                setSelectedDrawingId(null);
                setIsDragging(false);
                setDragStartPos(null);
                setDragInitialPoints(null);
                // Disable canvas events temporarily to let the event pass through to the chart
                setIsCanvasEventsEnabled(false);
                setTimeout(() => setIsCanvasEventsEnabled(true), 50);
            }

            setDrawings(newDrawings);
            return;
        }

        if (activeTool === 'delete') {
            console.log('[Drawing] Clearing all drawings');
            setDrawings([]);
            setCurrentDrawing(null);
            setSelectedDrawingId(null);
            return;
        }

        const time = chartRef.current.timeScale().coordinateToTime(x);
        const price = candlestickSeriesRef.current.coordinateToPrice(y);

        console.log('[Drawing] Coordinates:', { x, y, time, price });

        if (time === null || price === null) return;

        if (currentDrawing && currentDrawing instanceof MultiPointDrawing && !currentDrawing.isComplete()) {
            currentDrawing.addPoint({ time, price });
            requestAnimationFrame(drawAll);
            return;
        }

        const newDrawing = createDrawingTool(activeTool);
        if (!newDrawing) {
            console.error('[Drawing] Failed to create drawing tool');
            return;
        }

        newDrawing.addPoint({ time, price });
        console.log('[Drawing] Drawing created, points:', newDrawing.getPoints());
        setCurrentDrawing(newDrawing);
    };

    const drawAll = useCallback(() => {
        if (!canvasRef.current || !chartRef.current || !candlestickSeriesRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const width = canvasRef.current.width;
        const height = canvasRef.current.height;
        ctx.clearRect(0, 0, width, height);

        // Draw all completed drawings from Ref (most stable)
        drawingsRef.current.forEach(drawing => {
            drawing.draw(ctx, chartRef.current!, candlestickSeriesRef.current!);
        });

        // Draw current drawing being created
        if (currentDrawing) {
            currentDrawing.draw(ctx, chartRef.current!, candlestickSeriesRef.current!);
        }
    }, [currentDrawing]);

    const handleCanvasMouseUp = useCallback(() => {
        setIsDragging(false);
        setDragStartPos(null);
        setDragInitialPoints(null);
        setDrawings([...drawingsRef.current]);

        if (!currentDrawing) return;

        if (currentDrawing.isComplete()) {
            setDrawings(prev => [...prev, currentDrawing]);
            setCurrentDrawing(null);

            // Reset tool for single-click tools
            if (currentDrawing instanceof HorizontalLine || currentDrawing instanceof VerticalLine) {
                setActiveTool(null);
            }
        }
    }, [currentDrawing]);

    const performMove = useCallback((x: number, y: number) => {
        if (!chartRef.current || !candlestickSeriesRef.current || !canvasRef.current) return;

        const timeScale = chartRef.current.timeScale();
        const logical = timeScale.coordinateToLogical(x);
        const price = candlestickSeriesRef.current.coordinateToPrice(y);

        // Implementation of movement while dragging
        if (isDragging && selectedDrawingId && dragStartPos && dragInitialPoints) {
            if (price === null || logical === null) {
                requestAnimationFrame(drawAll);
                return;
            }

            const drawing = drawingsRef.current.find(d => d.getId() === selectedDrawingId);
            if (drawing) {
                const deltaPrice = price - dragStartPos.price;
                const deltaLogical = logical - dragStartPos.logical;

                if (deltaPrice !== 0 || deltaLogical !== 0) {
                    const newPoints = dragInitialPoints.map(p => {
                        const pCoord = timeScale.timeToCoordinate(p.time);
                        const pLogical = pCoord !== null ? timeScale.coordinateToLogical(pCoord) : null;

                        if (pLogical === null) return { ...p, price: p.price + deltaPrice };

                        const targetLogical = pLogical + deltaLogical;
                        const targetCoord = timeScale.logicalToCoordinate(targetLogical as any);
                        const targetTime = targetCoord !== null ? timeScale.coordinateToTime(targetCoord) : null;

                        return {
                            price: p.price + deltaPrice,
                            time: targetTime || p.time
                        };
                    });

                    if (!newPoints.some(p => isNaN(p.price))) {
                        drawing.setPoints(newPoints);
                    }
                }
                requestAnimationFrame(drawAll);
                return;
            }
        }

        const time = timeScale.coordinateToTime(x);
        if (time === null || price === null) {
            requestAnimationFrame(drawAll);
            return;
        }

        if (!currentDrawing) {
            requestAnimationFrame(drawAll);
            return;
        }

        if (currentDrawing instanceof HorizontalLine || currentDrawing instanceof VerticalLine) {
            currentDrawing.updateLastPoint({ time, price });
        } else if (currentDrawing instanceof BrushDrawing) {
            currentDrawing.addPoint({ time, price });
        } else if (currentDrawing instanceof MultiPointDrawing) {
            currentDrawing.updateLastPoint({ time, price });
        } else if (currentDrawing) {
            if (currentDrawing.getPoints().length === 1) {
                currentDrawing.addPoint({ time, price });
            } else {
                currentDrawing.updateLastPoint({ time, price });
            }
        }

        requestAnimationFrame(drawAll);
    }, [isDragging, selectedDrawingId, dragStartPos, dragInitialPoints, currentDrawing, drawAll]);

    const handleCanvasMouseMove = (e: React.MouseEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        performMove(x, y);
    };

    // Global drag handling to ensure smoothness and robustness
    useEffect(() => {
        if (!isDragging) return;

        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            performMove(x, y);
        };

        const handleGlobalMouseUp = () => {
            handleCanvasMouseUp();
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, performMove, handleCanvasMouseUp]);

    // Redraw when tool or selection changes
    useEffect(() => {
        requestAnimationFrame(drawAll);
    }, [activeTool, selectedDrawingId, drawAll]);

    // Cleanup unfinished drawings when tool changes
    useEffect(() => {
        if (currentDrawing && !currentDrawing.isComplete()) {
            setCurrentDrawing(null);
            requestAnimationFrame(drawAll);
        }
    }, [activeTool]);

    // Keep drawingsRef in sync
    useEffect(() => {
        drawingsRef.current = drawings;
        requestAnimationFrame(drawAll);
    }, [drawings, drawAll]);

    // Handle Delete key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedDrawingId) {
                // Check if user is typing in an input first
                if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
                    return;
                }
                setDrawings(prev => prev.filter(d => d.getId() !== selectedDrawingId));
                setSelectedDrawingId(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedDrawingId]);

    // Format number with commas
    const formatPrice = (price: number) => {
        return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatVolume = (vol: number) => {
        if (vol >= 1000000) return (vol / 1000000).toFixed(2) + 'M';
        if (vol >= 1000) return (vol / 1000).toFixed(2) + 'K';
        return vol.toFixed(2);
    };

    const toggleIndicator = (name: string) => {
        setActiveIndicators(prev =>
            prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
        );
    };

    const indicatorItems = [
        {
            key: 'MA7',
            label: (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100px' }}>
                    <span>MA 7</span>
                    {activeIndicators.includes('MA7') && <EyeOutlined style={{ color: '#0ecb81' }} />}
                </div>
            ),
            onClick: () => toggleIndicator('MA7')
        },
        {
            key: 'MA25',
            label: (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100px' }}>
                    <span>MA 25</span>
                    {activeIndicators.includes('MA25') && <EyeOutlined style={{ color: '#0ecb81' }} />}
                </div>
            ),
            onClick: () => toggleIndicator('MA25')
        },
        {
            key: 'MA99',
            label: (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100px' }}>
                    <span>MA 99</span>
                    {activeIndicators.includes('MA99') && <EyeOutlined style={{ color: '#0ecb81' }} />}
                </div>
            ),
            onClick: () => toggleIndicator('MA99')
        },
        { type: 'divider' as const },
        { key: 'BOLL', label: 'Bollinger Bands', disabled: true },
        { key: 'VOL', label: 'Volume', disabled: true },
    ];

    // Category-based drawing tools (OKX Style - Reorganized by User)
    const toolCategories = [
        {
            key: 'lines',
            title: 'Đường',
            icon: <LineOutlined />,
            items: [
                { key: 'line', label: 'Đường xu hướng', icon: <LineOutlined />, disabled: false },
                { key: 'ray', label: 'Tia', icon: <LineOutlined />, disabled: false },
                { key: 'h-line', label: 'Đường nằm ngang', icon: <ArrowsAltOutlined style={{ transform: 'rotate(90deg)' }} />, disabled: false },
                { key: 'v-line', label: 'Đường thẳng đứng', icon: <ArrowsAltOutlined />, disabled: false },
            ]
        },
        {
            key: 'patterns',
            title: 'Các mẫu hình',
            icon: <NodeIndexOutlined />,
            items: [
                { key: 'xabcd', label: 'Mẫu hình XABCD', icon: <NodeIndexOutlined />, disabled: false },
                { key: 'cypher', label: 'Mẫu hình Cypher', icon: <NodeIndexOutlined />, disabled: false },
                { key: 'head-shoulders', label: 'Vai Đầu Vai', icon: <NodeIndexOutlined />, disabled: false },
                { key: 'abcd', label: 'Mẫu hình ABCD', icon: <NodeIndexOutlined />, disabled: false },
                { key: 'elliott-impulse', label: 'Sóng Đẩy Elliott (12345)', icon: <DotChartOutlined />, disabled: false },
                { key: 'elliott-abc', label: 'Sóng Điều Chỉnh Elliott (ABC)', icon: <DotChartOutlined />, disabled: false },
            ]
        },
        {
            key: 'projections',
            title: 'Phép chiếu',
            icon: <FunctionOutlined />,
            items: [
                { key: 'fib', label: 'Fibonacci Thoái lui', icon: <FunctionOutlined />, disabled: false },
                { key: 'fib-ext', label: 'Fibonacci Mở rộng', icon: <FunctionOutlined />, disabled: false },
            ]
        },
        {
            key: 'brush',
            title: 'Cọ',
            icon: <EditOutlined />,
            items: [
                { key: 'brush', label: 'Cọ vẽ', icon: <EditOutlined />, disabled: false },
                { key: 'rect', label: 'Hình chữ nhật', icon: <HighlightOutlined />, disabled: false },
                { key: 'circle', label: 'Hình tròn', icon: <BlockOutlined />, disabled: false },
            ]
        },
        {
            key: 'annotations',
            title: 'Văn bản chú thích',
            icon: <FontSizeOutlined />,
            items: [
                { key: 'text', label: 'Văn bản', icon: <FontSizeOutlined />, disabled: false },
                { key: 'callout', label: 'Chú thích', icon: <FontSizeOutlined />, disabled: false },
            ]
        },
        {
            key: 'measurement',
            title: 'Đo lường',
            icon: <AreaChartOutlined />,
            items: [
                { key: 'price-range', label: 'Khoảng giá', icon: <ColumnHeightOutlined />, disabled: false },
                { key: 'time-range', label: 'Khoảng thời gian', icon: <ArrowsAltOutlined />, disabled: false },
            ]
        }
    ];

    // Helper to get active tool's icon or category default
    const getCategoryIcon = (cat: any) => {
        if (!cat || !cat.items) return null;
        const activeItem = cat.items.find((it: any) => it.key === activeTool);
        return activeItem ? activeItem.icon : cat.icon;
    };

    return (
        <div className={styles.container}>
            {/* Header with timeframes - Symbol removed as it is in MarketInfo */}
            <div className={styles.header}>
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
                    <Dropdown
                        menu={{ items: indicatorItems, theme: 'dark' }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <button className={styles.toolBtn} title="Chỉ báo">
                            <BarChartOutlined />
                        </button>
                    </Dropdown>
                    <button className={styles.toolBtn} title="Cài đặt">
                        <SettingOutlined />
                    </button>
                    <button className={styles.toolBtn} title="Toàn màn hình">
                        <ExpandOutlined />
                    </button>
                </div>
            </div>

            <div className={styles.mainArea}>
                {/* Left Sidebar Toolbar */}
                <div className={styles.sidebar}>
                    <Tooltip title="Cursor" placement="right">
                        <button
                            className={`${styles.sidebarBtn} ${activeTool === 'cursor' || !activeTool ? styles.active : ''}`}
                            onClick={() => setActiveTool('cursor')}
                        >
                            <AimOutlined />
                        </button>
                    </Tooltip>

                    <Divider className={styles.sidebarDivider} />

                    {toolCategories.map(cat => (
                        <Dropdown
                            key={cat.key}
                            trigger={['click']}
                            placement="bottomRight"
                            overlayClassName={styles.sidebarDropdown}
                            menu={{
                                items: cat.items.map(item => ({
                                    key: item.key,
                                    label: item.label,
                                    icon: item.icon,
                                    disabled: item.disabled,
                                    onClick: () => {
                                        console.log('[Drawing] Selected tool:', item.key);
                                        setActiveTool(item.key);
                                    }
                                })),
                                theme: 'dark'
                            }}
                        >
                            <Tooltip title={cat.title} placement="right">
                                <button className={`${styles.sidebarBtn} ${cat.items.some(it => it.key === activeTool) ? styles.active : ''}`}>
                                    {getCategoryIcon(cat)}
                                    <span className={styles.dropdownCorner}></span>
                                </button>
                            </Tooltip>
                        </Dropdown>
                    ))}

                    <Divider className={styles.sidebarDivider} />

                    <Tooltip title="Delete All" placement="right">
                        <button className={styles.sidebarBtn} onClick={() => {
                            setDrawings([]);
                            setCurrentDrawing(null);
                        }}>
                            <DeleteOutlined />
                        </button>
                    </Tooltip>

                    <Tooltip title="Hide/Show" placement="right">
                        <button className={styles.sidebarBtn}><EyeOutlined /></button>
                    </Tooltip>
                </div>

                {/* Chart area with OHLCV legend overlay */}
                <div className={styles.chartArea}>
                    {/* OHLCV Legend */}
                    {currentCandle && (
                        <div className={styles.legend}>
                            <div className={styles.legendOhlc}>
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
                                <span className={currentCandle.change >= 0 ? styles.legendChangeUp : styles.legendChangeDown}>
                                    {currentCandle.change >= 0 ? '+' : ''}{formatPrice(currentCandle.change)} ({currentCandle.changePercent >= 0 ? '+' : ''}{currentCandle.changePercent.toFixed(2)}%)
                                </span>
                            </div>
                            <div className={styles.legendIndicators}>
                                {activeIndicators.map(ind => (
                                    <span key={ind} className={styles.indicatorValue} style={{ color: ind === 'MA7' ? '#f0b90b' : ind === 'MA25' ? '#e443ff' : '#4a76ff' }}>
                                        {ind}: {currentCandle.close.toFixed(1)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={chartContainerRef} className={styles.chartContainer}>
                        <canvas
                            ref={canvasRef}
                            className={styles.drawingCanvas}
                            onMouseDown={handleCanvasMouseDown}
                            onMouseMove={handleCanvasMouseMove}
                            onMouseUp={handleCanvasMouseUp}
                            onMouseLeave={handleCanvasMouseUp}
                            style={{
                                cursor: isDragging ? 'grabbing' : (isHoveringDrawing ? 'pointer' : (activeTool && activeTool !== 'cursor' ? 'crosshair' : 'default')),
                                pointerEvents: (activeTool && activeTool !== 'cursor') || isHoveringDrawing || isDragging ? 'all' : 'none',
                                zIndex: 10
                            }}
                        />

                        {/* Selected Text Editing Overlay */}
                        {selectedDrawingId && drawings.find(d => d.getId() === selectedDrawingId) instanceof TextDrawing && (
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '30px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: '#1e2329',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #363c4e',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    zIndex: 1001,
                                    width: '240px'
                                }}
                            >
                                <div style={{ color: '#848e9c', fontSize: '12px' }}>Sửa nội dung văn bản:</div>
                                <input
                                    autoFocus
                                    defaultValue={(drawings.find(d => d.getId() === selectedDrawingId) as TextDrawing).getText()}
                                    style={{
                                        background: '#0b0e11',
                                        border: '1px solid #363c4e',
                                        color: 'white',
                                        padding: '6px 10px',
                                        borderRadius: '4px',
                                        outline: 'none',
                                        fontSize: '14px'
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const newText = (e.target as HTMLInputElement).value;
                                            const d = drawings.find(d => d.getId() === selectedDrawingId) as TextDrawing;
                                            d.setText(newText);
                                            setSelectedDrawingId(null);
                                            requestAnimationFrame(drawAll);
                                        }
                                        if (e.key === 'Escape') setSelectedDrawingId(null);
                                    }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button
                                        onClick={() => {
                                            setDrawings(prev => prev.filter(d => d.getId() !== selectedDrawingId));
                                            setSelectedDrawingId(null);
                                        }}
                                        style={{ background: '#f6465d', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                    >
                                        Xóa
                                    </button>
                                    <button
                                        onClick={() => setSelectedDrawingId(null)}
                                        style={{ background: '#f0b90b', border: 'none', color: '#000', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {loading && (
                        <div className={styles.loadingOverlay}>
                            <div className={styles.spinner}></div>
                            <span>Đang tải...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
