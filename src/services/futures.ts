import axios from '@/src/libs/axios';
import { FuturesCoin, FuturesOrderRequest, ClosePositionRequest, AdjustLeverageRequest } from '@/src/types/futures';

const FuturesService = {
    async getFuturesCoins() {
        return axios.get<{ message: string; data: FuturesCoin[] }>('/api/v1/futures/coins');
    },

    async placeFuturesOrder(orderData: FuturesOrderRequest) {
        return axios.post('/api/v1/futures/order', orderData);
    },

    async closePosition(data: ClosePositionRequest) {
        return axios.post('/api/v1/futures/position/close', data);
    },

    async adjustLeverage(data: AdjustLeverageRequest) {
        return axios.post('/api/v1/futures/leverage', data);
    },
};

export default FuturesService;
