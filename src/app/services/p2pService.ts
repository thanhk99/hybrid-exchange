import { P2POrder, P2PTrade, P2PFilters, PaymentMethod } from '../types/p2p';
import axiosInstance from '../lib/api/axios';
import { API_CONFIG } from '../lib/constants';

class P2PService {
  async getOrders(filters: P2PFilters): Promise<P2POrder[]> {
    const queryParams = new URLSearchParams({
      crypto: filters.cryptocurrency,
      fiat: filters.fiatCurrency,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      onlineOnly: filters.onlineOnly.toString()
    });

    if (filters.paymentMethods.length > 0) {
      queryParams.append('paymentMethods', filters.paymentMethods.join(','));
    }

    const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.P2P?.ORDERS || '/api/v1/p2p/orders'}?${queryParams}`);
    if (!response.data) throw new Error('Lỗi tải danh sách đơn hàng');
    return response.data.data || response.data;
  }

  async createOrder(orderData: Partial<P2POrder>): Promise<P2POrder> {
    const response = await axiosInstance.post(`${API_CONFIG.ENDPOINTS.P2P?.ORDERS || '/api/v1/p2p/orders'}`, orderData);
    
    if (!response.data) throw new Error('Lỗi tạo đơn hàng');
    return response.data.data || response.data;
  }

  async initiateTrade(orderId: string, amount: number): Promise<P2PTrade> {
    const response = await axiosInstance.post(`${API_CONFIG.ENDPOINTS.P2P?.TRADES || '/api/v1/p2p/trades'}`, { 
      orderId, 
      amount 
    });
    
    if (!response.data) throw new Error('Lỗi khởi tạo giao dịch');
    return response.data.data || response.data;
  }

  async getMyOrders(): Promise<P2POrder[]> {
    const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.P2P?.MY_ORDERS || '/api/v1/p2p/my-orders'}`);
    
    if (!response.data) throw new Error('Lỗi tải đơn hàng của tôi');
    return response.data.data || response.data;
  }

  async getActiveTrades(): Promise<P2PTrade[]> {
    const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.P2P?.ACTIVE_TRADES || '/api/v1/p2p/trades/active'}`);
    
    if (!response.data) throw new Error('Lỗi tải giao dịch đang diễn ra');
    return response.data.data || response.data;
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.P2P?.PAYMENT_METHODS || '/api/v1/p2p/payment-methods'}`);
    if (!response.data) throw new Error('Lỗi tải phương thức thanh toán');
    return response.data.data || response.data;
  }

  async updateTradeStatus(tradeId: string, status: string): Promise<P2PTrade> {
    const response = await axiosInstance.put(`${API_CONFIG.ENDPOINTS.P2P?.TRADES || '/api/v1/p2p/trades'}/${tradeId}/status`, {
      status
    });
    
    if (!response.data) throw new Error('Lỗi cập nhật trạng thái giao dịch');
    return response.data.data || response.data;
  }
}

export default new P2PService();