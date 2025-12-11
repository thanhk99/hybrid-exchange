"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as echarts from 'echarts';
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
    const [timeframe, setTimeframe] = useState('1m'); // default timeframe
    const [loading, setLoading] = useState(true);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<echarts.ECharts | null>(null);
    const legendRef = useRef<HTMLDivElement>(null);
    const stompClientRef = useRef<StompClient | null>(null);

    const buildOption = useCallback((priceData: any[], volumeData: any[]) => {
        return {
            animation: false,
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' },
                formatter: (params: any) => {
                    // params is an array of series data at the hovered point
                    const candle = params.find((p: any) => p.seriesType === 'candlestick');
                    const vol = params.find((p: any) => p.seriesType === 'bar');
                    if (!candle) return '';
                    // ECharts passes data as array in value or data
                    const [time, open, close, low, high] = candle.value || candle.data;
                    const date = new Date(time).toLocaleString();
                    const color = open <= close ? '#0ECB81' : '#F6465D';
                    let html = `<div style="font-family: monospace; font-size:12px;">
            <div>${date}</div>
            <div>O: <span style="color:${color}">${open.toFixed(2)}</span></div>
            <div>C: <span style="color:${color}">${close.toFixed(2)}</span></div>
            <div>H: <span style="color:${color}">${high.toFixed(2)}</span></div>
            <div>L: <span style="color:${color}">${low.toFixed(2)}</span></div>`;
                    if (vol) {
                        const [_, volume] = vol.value || vol.data;
                        html += `<div>Vol: <span style="color:${color}">${volume}</span></div>`;
                    }
                    html += `</div>`;
                    return html;
                },
            },
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: [0, 1],
                    start: 90,
                    end: 100,
                    minSpan: 10, // Minimum 1% of data visible
                    maxSpan: 90, // Maximum 90% of data visible (allows dragging)
                    zoomLock: false
                }
            ],
            axisPointer: {
                link: { xAxisIndex: 'all' }
            },
            xAxis: [
                {
                    type: 'time',
                    boundaryGap: ['0%', '5%'],
                    gridIndex: 0,
                    axisLabel: { show: false },
                    axisLine: { show: false },
                    axisTick: { show: false }
                },
                {
                    type: 'time',
                    boundaryGap: ['0%', '1%'],
                    gridIndex: 1,
                    axisLine: { show: false },
                    axisTick: { show: false }
                }
            ],
            yAxis: [
                // Price axis (right, top pane)
                {
                    type: 'value',
                    position: 'right',
                    scale: true,
                    splitLine: { show: false },
                    gridIndex: 0,
                    min: (value: { min: number; max: number }) => {
                        const diff = value.max - value.min;
                        // Add 10% padding to the bottom, handle flat line case
                        return value.min - (diff === 0 ? 1 : diff * 0.1);
                    },
                    max: (value: { min: number; max: number }) => {
                        const diff = value.max - value.min;
                        // Add 10% padding to the top, handle flat line case
                        return value.max + (diff === 0 ? 1 : diff * 0.1);
                    },
                    axisLabel: {
                        formatter: (value: number) => value.toFixed(1)
                    }
                },
                // Volume axis (right, bottom pane)
                {
                    type: 'value',
                    position: 'right',
                    scale: true,
                    splitLine: { show: false },
                    gridIndex: 1,
                },
            ],
            grid: [
                // Price pane (top 70%)
                { left: '10%', right: '10%', top: '5%', height: '70%' },
                // Volume pane (bottom 20%)
                { left: '10%', right: '10%', top: '78%', height: '20%' },
            ],
            series: [
                {
                    name: 'Price',
                    type: 'candlestick',
                    data: priceData,
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    itemStyle: {
                        color: '#F6465D', // down color
                        color0: '#0ECB81', // up color
                        borderColor: '#F6465D',
                        borderColor0: '#0ECB81',
                    },
                },
                {
                    name: 'Volume',
                    type: 'bar',
                    data: volumeData,
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    barWidth: '60%',
                    itemStyle: { color: '#7f8fa6' },
                },
            ],
        };
    }, []);

    const fetchData = useCallback(async () => {
        if (!symbol) return;
        setLoading(true);
        try {
            const response = await FuturesChartService.getKlineData(symbol, timeframe, 1000);
            if (response.success && response.data) {
                // Build price data: [timestamp, open, close, low, high]
                const priceData: any[] = [];
                const volumeData: any[] = [];
                const sorted = [...response.data].sort((a: KlineData, b: KlineData) => a.startTime - b.startTime);
                for (let i = 0; i < sorted.length; i++) {
                    const item = sorted[i];
                    const time = item.startTime; // milliseconds
                    // Ensure open is previous close for smoothing (except first)
                    const open = i === 0 ? item.openPrice : sorted[i - 1].closePrice;
                    const close = item.closePrice;
                    // Adjust high/low to include the modified open
                    const high = Math.max(item.highPrice, open);
                    const low = Math.min(item.lowPrice, open);
                    priceData.push([time, open, close, low, high]);
                    volumeData.push([time, item.volume]);
                }
                // Apply to chart
                if (chartRef.current) {
                    chartRef.current.setOption(buildOption(priceData, volumeData), true);
                }
            }
        } catch (e) {
            console.error('Failed to fetch chart data', e);
        } finally {
            setLoading(false);
        }
    }, [symbol, timeframe, buildOption]);

    // ---------- WebSocket real‑time updates ----------
    useEffect(() => {
        if (!symbol) return;
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const wsBase = apiUrl.replace(/^http/, 'ws');
        const wsUrl = `${wsBase}/ws/websocket`;
        const client = new StompClient(wsUrl);
        stompClientRef.current = client;

        client.connect(() => {
            console.log('WebSocket Connected for Chart');
            const normalized = symbol.replace(/-/g, '').toLowerCase();
            let topic = `/topic/futures/kline/${timeframe}/${normalized}`;
            if (timeframe === '1s') topic = `/topic/futures/kline/1s/${normalized}`;

            client.subscribe(topic, (msg: WSKlineData) => {
                if (!chartRef.current) return;
                const chart = chartRef.current;
                const option = chart.getOption() as any;
                const priceSeries = option.series?.[0];
                const volumeSeries = option.series?.[1];

                if (!priceSeries || !volumeSeries) return;

                const time = msg.t;
                // Determine open price based on last candle
                const lastCandle = priceSeries.data?.[priceSeries.data.length - 1] as any[] | undefined;
                const open = lastCandle ? lastCandle[2] : msg.o; // use previous close if exists

                // Adjust high/low to include the modified open
                const high = Math.max(msg.h, open);
                const low = Math.min(msg.l, open);

                const newCandle = [time, open, msg.c, low, high];
                const newVolume = [time, msg.v];

                // Append data
                if (priceSeries.data) {
                    priceSeries.data.push(newCandle);
                }
                if (volumeSeries.data) {
                    volumeSeries.data.push(newVolume);
                }

                chart.setOption({ series: [priceSeries, volumeSeries] }, false);
            });
        });

        return () => {
            client.disconnect();
        };
    }, [symbol, timeframe]);

    useEffect(() => {
        if (!chartContainerRef.current) return;
        const chart = echarts.init(chartContainerRef.current);
        chartRef.current = chart;

        // Initial empty option to reserve layout
        chart.setOption(buildOption([], []), true);

        const resizeHandler = () => {
            chart.resize();
        };
        window.addEventListener('resize', resizeHandler);
        return () => {
            window.removeEventListener('resize', resizeHandler);
            chart.dispose();
        };
    }, [buildOption]);

    useEffect(() => {
        fetchData();
    }, [timeframe, fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className={styles.container}>
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
                    <button className={styles.toolBtn} title="Chỉ báo">📊</button>
                    <button className={styles.toolBtn} title="Vẽ">✏️</button>
                    <button className={styles.toolBtn} title="Cài đặt">⚙️</button>
                </div>
            </div>
            <div className={styles.chartArea}>
                <div ref={legendRef} className={styles.legend} />
                <div ref={chartContainerRef} className={styles.chartContainer} />
                {loading && <div className={styles.loadingOverlay}>Loading...</div>}
            </div>
        </div>
    );
}
