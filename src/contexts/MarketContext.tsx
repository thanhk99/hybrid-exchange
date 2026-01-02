'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import MarketService, { MarketCoin } from '../services/market';
import FuturesService from '../services/futures';
import { FuturesCoin } from '../types/futures';
import { StompClient } from '../services/socket';

type MarketType = 'spot' | 'futures';
type MarketData = MarketCoin | FuturesCoin;

interface MarketContextType {
    marketData: MarketData | null;
    allCoins: MarketData[];
    loading: boolean;
    error: string | null;
    currentSymbol: string;
    setCurrentSymbol: (symbol: string) => void;
    selectedPrice: number | null;
    setSelectedPrice: (price: number | null) => void;
    marketType: MarketType;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const useMarket = () => {
    const context = useContext(MarketContext);
    if (!context) {
        throw new Error('useMarket must be used within MarketProvider');
    }
    return context;
};

interface MarketProviderProps {
    children: ReactNode;
    initialSymbol: string;
    marketType: MarketType;
}

export const MarketProvider: React.FC<MarketProviderProps> = ({
    children,
    initialSymbol,
    marketType
}) => {
    const [allCoins, setAllCoins] = useState<MarketData[]>([]);
    const [marketData, setMarketData] = useState<MarketData | null>(null);
    const [currentSymbol, setCurrentSymbol] = useState(initialSymbol);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

    const stompClientRef = useRef<StompClient | null>(null);
    const isConnectedRef = useRef(false);

    // Normalize symbol for comparison (remove hyphens, uppercase)
    const normalizedSymbol = currentSymbol.replace(/-/g, '').toUpperCase();

    // Fetch initial data based on market type
    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (marketType === 'spot') {
                const response = await MarketService.getMarkets();
                if (response.data && response.data.data) {
                    const coins = response.data.data;
                    setAllCoins(coins);

                    const coin = coins.find(
                        c => c.symbol.replace(/-/g, '').toUpperCase() === normalizedSymbol
                    );
                    if (coin) {
                        setMarketData(coin);
                    }
                }
            } else {
                const response = await FuturesService.getFuturesCoins();
                if (response.data && response.data.data) {
                    const coins = response.data.data;
                    setAllCoins(coins);

                    const coin = coins.find(
                        c => c.symbol.replace(/-/g, '').toUpperCase() === normalizedSymbol
                    );
                    if (coin) {
                        setMarketData(coin);
                    }
                }
            }
        } catch (e) {
            console.error(`Failed to fetch ${marketType} markets`, e);
            setError('Failed to fetch market data');
        } finally {
            setLoading(false);
        }
    }, [normalizedSymbol, marketType]);

    // Connect to WebSocket for real-time updates
    const connectWebSocket = useCallback(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const wsBase = apiUrl.replace(/^http/, 'ws');
        const finalWsUrl = `${wsBase}/ws/websocket`;

        const client = new StompClient(finalWsUrl);
        client.connect(() => {
            isConnectedRef.current = true;
            client.subscribe('/topic/spot-prices', (updates: any) => {
                const updateArray = Array.isArray(updates) ? updates : [updates];

                // Update all coins
                setAllCoins(prevCoins => {
                    const updatedCoins = [...prevCoins];
                    updateArray.forEach(update => {
                        const normalizedUpdateSymbol = update.symbol.replace(/[\/-]/g, '').toUpperCase();
                        const index = updatedCoins.findIndex(
                            c => c.symbol.replace(/[\/-]/g, '').toUpperCase() === normalizedUpdateSymbol
                        );
                        if (index >= 0) {
                            // Map WebSocket fields based on market type
                            const mappedUpdate = marketType === 'spot' ? {
                                ...update,
                                currentPrice: update.price ? Number(update.price) : (updatedCoins[index] as MarketCoin).currentPrice,
                                priceChange24h: update.changePercent ? Number(update.changePercent) : updatedCoins[index].priceChange24h,
                            } : {
                                ...update,
                                markPrice: update.price ? Number(update.price) : undefined,
                                lastPrice: update.price ? Number(update.price) : undefined,
                                priceChange24h: update.changePercent ? Number(update.changePercent) : undefined,
                            };
                            updatedCoins[index] = { ...updatedCoins[index], ...mappedUpdate };
                        }
                    });
                    return updatedCoins;
                });

                // Update current symbol's market data
                const update = updateArray.find(
                    u => u.symbol.replace(/[\/-]/g, '').toUpperCase() === normalizedSymbol
                );
                if (update) {
                    const mappedUpdate = marketType === 'spot' ? {
                        ...update,
                        currentPrice: update.price ? Number(update.price) : undefined,
                        priceChange24h: update.changePercent ? Number(update.changePercent) : undefined,
                    } : {
                        ...update,
                        markPrice: update.price ? Number(update.price) : undefined,
                        lastPrice: update.price ? Number(update.price) : undefined,
                        priceChange24h: update.changePercent ? Number(update.changePercent) : undefined,
                    };
                    setMarketData(prev => prev ? { ...prev, ...mappedUpdate } : mappedUpdate as MarketData);
                }
            });
        });
        stompClientRef.current = client;
    }, [normalizedSymbol, marketType]);

    useEffect(() => {
        fetchInitialData();
        connectWebSocket();

        return () => {
            if (stompClientRef.current && isConnectedRef.current) {
                stompClientRef.current.disconnect();
                isConnectedRef.current = false;
            }
        };
    }, [fetchInitialData, connectWebSocket]);

    // Update marketData when symbol changes and we already have coins
    useEffect(() => {
        if (allCoins.length > 0) {
            const coin = allCoins.find(
                c => c.symbol.replace(/-/g, '').toUpperCase() === normalizedSymbol
            );
            if (coin) {
                setMarketData(coin);
            }
        }
    }, [normalizedSymbol, allCoins]);

    const value: MarketContextType = {
        marketData,
        allCoins,
        loading,
        error,
        currentSymbol,
        setCurrentSymbol,
        selectedPrice,
        setSelectedPrice,
        marketType,
    };

    return (
        <MarketContext.Provider value={value}>
            {children}
        </MarketContext.Provider>
    );
};
