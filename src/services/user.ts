import axiosInstance from "../libs/axios";

export default class UserService {
  static async getProfile(): Promise<any> {
    try {
      const response = await axiosInstance.get('/user/profile');
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async updateProfile(userData: any): Promise<any> {
    try {
      const response = await axiosInstance.put('/user/profile', userData);
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async getBalance(): Promise<any> {
    try {
      const response = await axiosInstance.get('/user/balance');
      return response;
    } catch (error) {
      console.error('Get balance error:', error);
      throw error;
    }
  }
}
