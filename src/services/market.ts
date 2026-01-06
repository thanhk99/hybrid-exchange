import { AxiosResponse } from "axios";
import axiosInstance from "../libs/axios";
import { ApiResponse } from "../types/common";

export interface MarketCoin {
    id?: string;
    symbol: string;
    currentPrice: number;
    priceChange24h: number;
    high24h?: number;
    low24h?: number;
    volume24h?: number;
    marketCap?: number;
    logoUrl?: string;
    lastUpdated?: string;
}

export interface MarketUpdate {
    symbol: string;
    price: number;
    percentChange: number;
}

export default class MarketService {
    static async getMarkets(): Promise<AxiosResponse<ApiResponse<MarketCoin[]>>> {
        try {
            const response = await axiosInstance.get<ApiResponse<MarketCoin[]>>('/api/v1/public/coin/list');
            return response;
        } catch (error) {
            console.error('Get markets error:', error);
            throw error;
        }
    }

    static async getExchangeRate(from: string, to: string): Promise<AxiosResponse<ApiResponse<number>>> {
        try {
            const response = await axiosInstance.get<ApiResponse<number>>(
                '/api/v1/public/coin/exchange-rate',
                { params: { from, to } }
            );
            return response;
        } catch (error) {
            console.error('Get exchange rate error:', error);
            throw error;
        }
    }
}
