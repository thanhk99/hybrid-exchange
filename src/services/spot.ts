import { AxiosResponse } from "axios";
import axiosInstance from "../libs/axios";
import { ApiResponse } from "../types/common";

// Order Book Entry
export interface OrderBookEntry {
    price: number;
    amount: number;
    total: number;
}

export interface OrderBookData {
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
}

// Spot Order Request
export interface SpotOrderRequest {
    symbol: string;
    price?: number;
    quantity: number;
    type: 'LIMIT' | 'MARKET';
    side: 'BUY' | 'SELL';
}

// Cancel Order Request
export interface CancelOrderRequest {
    id: number;
}

export default class SpotService {
    // Get Order Book
    static async getOrderBook(symbol: string, limit: number = 20): Promise<AxiosResponse<ApiResponse<OrderBookData>>> {
        try {
            const response = await axiosInstance.get<ApiResponse<OrderBookData>>(
                `/api/v1/public/spot/orderbook/${symbol}`,
                { params: { limit } }
            );
            return response;
        } catch (error) {
            console.error('Get order book error:', error);
            throw error;
        }
    }

    // Create Order (Buy/Sell)
    static async createOrder(data: SpotOrderRequest): Promise<AxiosResponse<ApiResponse<any>>> {
        try {
            const response = await axiosInstance.post<ApiResponse<any>>(
                '/api/v1/spot/create',
                data
            );
            return response;
        } catch (error) {
            console.error('Create order error:', error);
            throw error;
        }
    }

    // Cancel Order
    static async cancelOrder(data: CancelOrderRequest): Promise<AxiosResponse<ApiResponse<any>>> {
        try {
            const response = await axiosInstance.post<ApiResponse<any>>(
                '/api/v1/spot/cancle',
                data
            );
            return response;
        } catch (error) {
            console.error('Cancel order error:', error);
            throw error;
        }
    }

    // Get Supported Symbols
    static async getSupportedSymbols(): Promise<AxiosResponse<ApiResponse<string[]>>> {
        try {
            const response = await axiosInstance.get<ApiResponse<string[]>>(
                '/api/v1/public/spot/kline/symbols'
            );
            return response;
        } catch (error) {
            console.error('Get symbols error:', error);
            throw error;
        }
    }

    // Get Supported Intervals
    static async getSupportedIntervals(): Promise<AxiosResponse<ApiResponse<string[]>>> {
        try {
            const response = await axiosInstance.get<ApiResponse<string[]>>(
                '/api/v1/public/spot/kline/intervals'
            );
            return response;
        } catch (error) {
            console.error('Get intervals error:', error);
            throw error;
        }
    }
}
