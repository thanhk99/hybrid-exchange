import axiosInstance from "../axios";
import { API_CONFIG } from "../../constants";

export interface FundingTotalResponse {
  totalValue: number;
  currency: string;
  pnlToday: number;
  pnlPercentage: number;
}

export interface FundingChartData {
  time: string;
  value: number;
}

export interface FundingHistoryItem {
  id: string;
  type: string;
  amount: string;
  timestamp: string;
  status: string;
}

export interface WalletAsset {
    symbol: string;
    name: string;
    holdings: number;
    value: number;
    pnl: number;
    pnlPercentage: number;
    logo?: string;
  }

export interface WalletResponse {
  totalValue: number;
  currency: string;
  pnlToday: number;
  pnlPercentage: number;
  assets: WalletAsset[];
  allocation: {
    funding: number;
    trading: number;
    earn: number;
  };
  chartData: FundingChartData[];
}

class FundingService {
  /**
   * Lấy tổng giá trị funding
   */
  static async getFundingTotal(): Promise<FundingTotalResponse> {
    try {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.FUNDING.TOTAL);
      // Handle API response structure {"data": number, "message": "success"}
      console.log('Funding API Response:', response.data);
      
      // Transform the API response to match the expected interface
      if (response.data && typeof response.data === 'object') {
        const totalValue = typeof response.data.data === 'number' ? response.data.data : 0;
        
        return {
          totalValue: totalValue,
          currency: 'USD',
          pnlToday: 0, // These would come from additional API calls or be included in the response
          pnlPercentage: 0
        };
      }
      
      // Fallback if response structure is unexpected
      return {
        totalValue: 0,
        currency: 'USD',
        pnlToday: 0,
        pnlPercentage: 0
      };
    } catch (error) {
      console.error('Error fetching funding total:', error);
      throw error;
    }
  }

  /**
   * Lấy dữ liệu biểu đồ funding theo khoảng thời gian
   */
  static async getFundingChartData(period: string = '1d'): Promise<FundingChartData[]> {
    try {
      const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.FUNDING.CHART_DATA}?period=${period}`);
      
      // Handle the API response structure
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data || [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching funding chart data:', error);
      throw error;
    }
  }

  /**
   * Lấy lịch sử funding
   */
  static async getFundingHistory(page: number = 1, limit: number = 10): Promise<{
    items: FundingHistoryItem[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.FUNDING.HISTORY}?page=${page}&limit=${limit}`);
      
      // Handle the API response structure
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data || { items: [], total: 0, page: 1, totalPages: 0 };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching funding history:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin wallet tổng quan
   */
  static async getWallet(): Promise<WalletResponse> {
    try {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.FUNDING.GET_WALLET);
      
      // Handle the API response structure
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      throw error;
    }
  }
}

export default FundingService;