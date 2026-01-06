import axiosInstance from "../libs/axios";

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
            const response = await axiosInstance.post('/api/v1/public/spot/kline', params);
            return response.data;
        } catch (error) {
            console.error('Error fetching spot kline data:', error);
            throw error;
        }
    }

    // Get Realtime Kline Data (RingBuffer - last 72 candles)
    static async getRealtimeKlineData(symbol: string): Promise<KlineResponse> {
        try {
            const response = await axiosInstance.post('/api/v1/public/spot/kline/realtime', {
                symbol
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching realtime spot kline data:', error);
            throw error;
        }
    }
}
