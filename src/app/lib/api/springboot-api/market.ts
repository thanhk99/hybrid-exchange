import axiosInstance from "../axios";
import { API_CONFIG } from "../../constants";

export interface TokenPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  rank: number;
}

export interface MarketData {
  prices: TokenPrice[];
  lastUpdated: string;
  totalMarketCap: number;
  totalVolume24h: number;
}

export type PriceCategory = 'favorites' | 'top' | 'popular' | 'gainers' | 'losers' | 'new';

class MarketService {
  static apiMarketPrices: string = API_CONFIG.ENDPOINTS.MARKET.PRICES;
  static apiTrendingTokens: string = API_CONFIG.ENDPOINTS.MARKET.TRENDING;

  /**
   * Lấy giá token theo danh mục
   */
  static async getTokenPrices(
    category: PriceCategory = 'top',
    limit: number = 50
  ): Promise<MarketData> {
    try {
      const response = await axiosInstance.get(
        `${this.apiMarketPrices}?category=${category}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching token prices:', error);
      throw error;
    }
  }

  /**
   * Lấy giá của token cụ thể
   */
  static async getTokenPrice(symbol: string): Promise<TokenPrice> {
    try {
      const response = await axiosInstance.get(`${this.apiMarketPrices}/${symbol}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Lấy danh sách token trending
   */
  static async getTrendingTokens(limit: number = 10): Promise<TokenPrice[]> {
    try {
      const response = await axiosInstance.get(`${this.apiTrendingTokens}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending tokens:', error);
      throw error;
    }
  }

  /**
   * Tìm kiếm token
   */
  static async searchTokens(query: string, limit: number = 20): Promise<TokenPrice[]> {
    try {
      const response = await axiosInstance.get(
        `${this.apiMarketPrices}/search?q=${encodeURIComponent(query)}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching tokens:', error);
      throw error;
    }
  }

  /**
   * Lấy lịch sử giá token
   */
  static async getTokenPriceHistory(
    symbol: string,
    period: string = '24h'
  ): Promise<Array<{ timestamp: number; price: number }>> {
    try {
      const response = await axiosInstance.get(
        `${this.apiMarketPrices}/${symbol}/history?period=${period}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching price history for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Thêm/xóa token khỏi danh sách yêu thích
   */
  static async toggleFavorite(symbol: string): Promise<{ isFavorite: boolean }> {
    try {
      const response = await axiosInstance.post(`${this.apiMarketPrices}/${symbol}/favorite`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling favorite for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Lấy danh sách token yêu thích
   */
  static async getFavoriteTokens(): Promise<TokenPrice[]> {
    try {
      const response = await axiosInstance.get(`${this.apiMarketPrices}?category=favorites`);
      return response.data.prices;
    } catch (error) {
      console.error('Error fetching favorite tokens:', error);
      throw error;
    }
  }
}

export default MarketService;