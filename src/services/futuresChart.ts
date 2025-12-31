import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface KlineData {
    symbol: string;
    openPrice: number;
    closePrice: number;
    highPrice: number;
    lowPrice: number;
    volume: number;
    startTime: number;
    closeTime: number;
    interval: string;
    isClosed: boolean;
}

export interface KlineResponse {
    symbol: string;
    interval: string;
    count: number;
    limit: number;
    success: boolean;
    message: string;
    data: KlineData[];
}

const FuturesChartService = {
    getKlineData: async (symbol: string, interval: string, limit: number = 288, endTime?: number): Promise<KlineResponse> => {
        try {
            // Normalize symbol: remove hyphens (e.g., BTC-USDT -> BTCUSDT)
            const normalizedSymbol = symbol.replace(/-/g, '');

            // Build query parameters
            const params: any = {
                symbol: normalizedSymbol,
                interval,
                limit
            };

            if (endTime) {
                params.endTime = endTime;
            }

            // Use GET method with query parameters as per new API spec
            const response = await axios.get(`${API_BASE_URL}/api/v1/futures/kline`, {
                params
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching futures kline data:', error);
            throw error;
        }
    }
};

export default FuturesChartService;
