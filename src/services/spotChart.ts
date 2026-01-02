import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface KlineData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface KlineResponse {
    data: KlineData[];
}

export interface KlineRequest {
    symbol: string;
    interval: string;
}

export default class SpotChartService {
    // Get Historical Kline Data
    static async getKlineData(params: KlineRequest): Promise<KlineResponse> {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/v1/public/spot/kline`, params);
            return response.data;
        } catch (error) {
            console.error('Error fetching spot kline data:', error);
            throw error;
        }
    }

    // Get Realtime Kline Data (RingBuffer - last 72 candles)
    static async getRealtimeKlineData(symbol: string): Promise<KlineResponse> {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/v1/public/spot/kline/realtime`, {
                symbol
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching realtime spot kline data:', error);
            throw error;
        }
    }
}
