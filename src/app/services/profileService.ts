import axiosInstance from '../lib/api/axios';
import { API_CONFIG } from '../lib/constants';
import { ProfileApiResponse, DevicesApiResponse } from '../types/profile';
import deviceService from './deviceService';

export const profileService = {
  // Lấy thông tin profile từ backend
  getProfile: async (): Promise<ProfileApiResponse> => {
    try {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.GETFULLPROFILE);
      console.log('Raw response:', response);
      console.log('Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Lấy danh sách thiết bị đăng nhập
  getLoginDevices: async (): Promise<DevicesApiResponse> => {
    try {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.DEVICE.DEVICES);
      console.log('Devices response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching login devices:', error);
      throw error;
    }
  },

  // Đăng xuất thiết bị
  logoutDevice: async (): Promise<{ message: string; success: boolean }> => {
    const deviceId = deviceService.getDeviceId();
    try {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.DEVICE.REVOKE, {
        deviceId: deviceId
      });
      console.log('Revoke device response:', response);
      return response.data;
    } catch (error) {
      console.error('Error revoking device:', error);
      throw error;
    }
  },

  // Cập nhật avatar
  updateAvatar: async (avatarFile: File): Promise<ProfileApiResponse> => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const response = await axiosInstance.post(
        API_CONFIG.ENDPOINTS.USER.UPDATE_AVATAR,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  },

  // Cập nhật profile
  updateProfile: async (profileData: Partial<any>): Promise<ProfileApiResponse> => {
    try {
      const response = await axiosInstance.put(
        API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE,
        profileData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};