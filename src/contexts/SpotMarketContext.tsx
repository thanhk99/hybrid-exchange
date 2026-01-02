'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import MarketService, { MarketCoin } from '../services/market';
import { StompClient } from '../services/socket';

interface SpotMarketContextType {
    marketData: MarketCoin | null;
    allCoins: MarketCoin[];
    loading: boolean;
    error: string | null;
    currentSymbol: string;
    setCurrentSymbol: (symbol: string) => void;
    selectedPrice: number | null;
    setSelectedPrice: (price: number | null) => void;
}

const SpotMarketContext = createContext<SpotMarketContextType | undefined>(undefined);

export const useSpotMarket = () => {
    const context = useContext(SpotMarketContext);
    if (!context) {
        throw new Error('useSpotMarket must be used within SpotMarketProvider');
    }
    return context;
};

interface SpotMarketProviderProps {
    children: ReactNode;
    initialSymbol: string;
}

export const SpotMarketProvider: React.FC<SpotMarketProviderProps> = ({ children, initialSymbol }) => {
    const [allCoins, setAllCoins] = useState<MarketCoin[]>([]);
    const [marketData, setMarketData] = useState<MarketCoin | null>(null);
    const [currentSymbol, setCurrentSymbol] = useState(initialSymbol);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

    const stompClientRef = useRef<StompClient | null>(null);
    const isConnectedRef = useRef(false);

    // Normalize symbol for comparison (remove hyphens, uppercase)
    const normalizedSymbol = currentSymbol.replace(/-/g, '').toUpperCase();

    // Fetch initial data - only once
    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await MarketService.getMarkets();
            if (response.data && response.data.data) {
                const coins = response.data.data;
                setAllCoins(coins);

                // Find current symbol's data
                const coin = coins.find(
                    c => c.symbol.replace(/-/g, '').toUpperCase() === normalizedSymbol
                );
                if (coin) {
                    setMarketData(coin);
                }
            }
        } catch (e) {
            console.error('Failed to fetch spot markets', e);
            setError('Failed to fetch market data');
        } finally {
            setLoading(false);
        }
    }, [normalizedSymbol]);

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
                            // Map WebSocket fields to MarketCoin interface
                            const mappedUpdate = {
                                ...update,
                                currentPrice: update.price ? Number(update.price) : updatedCoins[index].currentPrice,
                                priceChange24h: update.changePercent ? Number(update.changePercent) : updatedCoins[index].priceChange24h,
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
                    const mappedUpdate = {
                        ...update,
                        currentPrice: update.price ? Number(update.price) : undefined,
                        priceChange24h: update.changePercent ? Number(update.changePercent) : undefined,
                    };
                    setMarketData(prev => prev ? { ...prev, ...mappedUpdate } : mappedUpdate as MarketCoin);
                }
            });
        });
        stompClientRef.current = client;
    }, [normalizedSymbol]);

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

    const value: SpotMarketContextType = {
        marketData,
        allCoins,
        loading,
        error,
        currentSymbol,
        setCurrentSymbol,
        selectedPrice,
        setSelectedPrice,
    };

    return (
        <SpotMarketContext.Provider value={value}>
            {children}
        </SpotMarketContext.Provider>
    );
};
