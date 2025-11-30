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
            const response = await axiosInstance.get<ApiResponse<MarketCoin[]>>('/api/v1/coin/markets');
            return response;
        } catch (error) {
            console.error('Get markets error:', error);
            throw error;
        }
    }
}
