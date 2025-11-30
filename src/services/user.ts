import { AxiosResponse } from "axios";
import axiosInstance from "../libs/axios";
import { UserInfo } from "../types/user";
import { ApiResponse } from "../types/common";

export default class UserService {
  static async getProfile(): Promise<AxiosResponse<ApiResponse<UserInfo>>> {
    try {
      const response = await axiosInstance.get<ApiResponse<UserInfo>>('api/v1/user/getProfile');
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async updateProfile(userData: any): Promise<AxiosResponse<ApiResponse<UserInfo>>> {
    try {
      const response = await axiosInstance.put<ApiResponse<UserInfo>>('api/v1/user/updateProfile', userData);
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async getBalance(): Promise<AxiosResponse<ApiResponse<any>>> {
    try {
      const response = await axiosInstance.get<ApiResponse<any>>('api/v1/user/getBalance');
      return response;
    } catch (error) {
      console.error('Get balance error:', error);
      throw error;
    }
  }

  static async searchUser(query: string): Promise<{ id: string; email: string; name: string; avatar?: string } | null> {
    try {
      // Mock implementation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulate finding a user
      if (query.includes('@') || query.startsWith('UID')) {
        return {
          id: 'user123',
          email: query.includes('@') ? query : 'user@example.com',
          name: 'Nguyễn Văn A',
          avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff'
        };
      }

      return null;
    } catch (error) {
      console.error('Search user error:', error);
      return null;
    }
  }

  static async changeName(name: string): Promise<AxiosResponse<ApiResponse<UserInfo>>> {
    try {
      const response = await axiosInstance.post<ApiResponse<UserInfo>>('api/v1/user/changeName', { username: name });
      return response;
    } catch (error) {
      console.error('Change name error:', error);
      throw error;
    }
  }

  static async changePhone(phone: string): Promise<AxiosResponse<ApiResponse<UserInfo>>> {
    try {
      const response = await axiosInstance.post<ApiResponse<UserInfo>>('api/v1/user/changePhone', { phone });
      return response;
    } catch (error) {
      console.error('Change phone error:', error);
      throw error;
    }
  }
}
