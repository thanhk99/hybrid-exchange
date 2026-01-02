import axiosInstance from '@/src/libs/axios';
import { FuturesCoin, FuturesOrderRequest, ClosePositionRequest, AdjustLeverageRequest } from '@/src/types/futures';

interface OrderBookResponse {
    symbol: string;
    bids: [string, string][]; // [price, amount]
    asks: [string, string][]; // [price, amount]
    lastUpdateId: number;
}

const FuturesService = {
    async getFuturesCoins() {
        return axiosInstance.get<{ message: string; data: FuturesCoin[] }>('/api/v1/public/futures/coins');
    },

    async getOrderBook(symbol: string) {
        return axiosInstance.get<{ message: string; data: OrderBookResponse }>(`/api/v1/futures/orders/orderbook/${symbol}`);
    },

    async placeFuturesOrder(orderData: FuturesOrderRequest) {
        return axiosInstance.post('/api/v1/futures/orders', orderData);
    },

    async closePosition(data: ClosePositionRequest) {
        return axiosInstance.post('/api/v1/futures/positions/close', data);
    },

    async adjustLeverage(data: AdjustLeverageRequest) {
        return axiosInstance.post('/api/v1/futures/positions/leverage', data);
    },
};

export default FuturesService;
