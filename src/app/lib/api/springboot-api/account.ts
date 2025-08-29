import axiosInstance from "../axios";
import { API_CONFIG } from "../../constants";

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  nation: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  tier: 'regular' | 'vip' | 'pro';
  isGoogleLinked: boolean;
  phone?: string;
  referralRate?: number;
  createdAt: string;
  lastLoginAt: string;
}

export interface AccountSecurity {
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus: 'verified' | 'pending' | 'rejected' | 'not_submitted';
  loginDevices: Array<{
    deviceId: string;
    deviceName: string;
    lastLogin: string;
    location: string;
  }>;
}

export interface AccountSettings {
  language: string;
  currency: string;
  timezone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  tradingNotifications: boolean;
}

// API Response wrapper interface
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

class AccountService {
  /**
   * Lấy thông tin profile người dùng
   */
  static async getUserProfile(): Promise<UserProfile> {
    try {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.GETPROFILE);
      
      // Handle API response structure {"data": ..., "message": "success"}
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin profile
   */
  static async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await axiosInstance.put(API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE, profileData);
      
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Cập nhật avatar
   */
  static async updateAvatar(avatarFile: File): Promise<{ avatarUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.USER.UPDATE_AVATAR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin bảo mật tài khoản
   */
  static async getAccountSecurity(): Promise<AccountSecurity> {
    try {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.SECURITY);
      
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching account security:', error);
      throw error;
    }
  }

  /**
   * Bật/tắt 2FA
   */
  static async toggle2FA(enable: boolean, code?: string): Promise<{ success: boolean; qrCode?: string }> {
    try {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.USER.TOGGLE_2FA, {
        enable,
        code
      });
      
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      throw error;
    }
  }

  /**
   * Đổi mật khẩu
   */
  static async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean }> {
    try {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.USER.CHANGE_PASSWORD, {
        currentPassword,
        newPassword
      });
      
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * Lấy cài đặt tài khoản
   */
  static async getAccountSettings(): Promise<AccountSettings> {
    try {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.SETTINGS);
      
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching account settings:', error);
      throw error;
    }
  }

  /**
   * Cập nhật cài đặt tài khoản
   */
  static async updateAccountSettings(settings: Partial<AccountSettings>): Promise<AccountSettings> {
    try {
      const response = await axiosInstance.put(API_CONFIG.ENDPOINTS.USER.SETTINGS, settings);
      
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating account settings:', error);
      throw error;
    }
  }

  /**
   * Xóa thiết bị đăng nhập
   */
  static async removeLoginDevice(deviceId: string): Promise<{ success: boolean }> {
    try {
      const response = await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.USER.DEVICES}/${deviceId}`);
      
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error removing login device:', error);
      throw error;
    }
  }
}

export default AccountService;