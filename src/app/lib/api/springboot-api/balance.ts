import axiosInstance from "../axios";
import { API_CONFIG } from "../../constants";

export interface BalanceData {
  totalValue: number;
  currency: string;
  pnlToday: number;
  pnlPercentage: number;
}

export interface BalanceApiResponse {
  success: boolean;
  data: BalanceData;
  message?: string;
}

class BalanceService {
  /**
   * Lấy tổng giá trị balance từ backend
   */
  static async getBalance(): Promise<BalanceData> {
    try {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.BALANCE.OVERVIEW);
      
      // Handle API response structure
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  /**
   * Lấy tổng giá trị funding (fallback method)
   */
  static async getFundingTotal(): Promise<BalanceData> {
    try {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.FUNDING.TOTAL);
      
      // Handle API response structure {"data": number, "message": "success"}
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return {
          totalValue: response.data.data || 0,
          currency: 'USD',
          pnlToday: 0,
          pnlPercentage: 0
        };
      }
      
      return {
        totalValue: response.data?.totalValue || 0,
        currency: response.data?.currency || 'USD',
        pnlToday: response.data?.pnlToday || 0,
        pnlPercentage: response.data?.pnlPercentage || 0
      };
    } catch (error) {
      console.error('Error fetching funding total:', error);
      throw error;
    }
  }
}

export default BalanceService;