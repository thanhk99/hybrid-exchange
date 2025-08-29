import axiosInstance from '../lib/api/axios';
import { API_CONFIG } from '../lib/constants';
import { ProfileApiResponse } from '../types/profile';

export const profileService = {
  // Lấy thông tin profile từ backend
  getProfile: async (): Promise<ProfileApiResponse> => {
    try {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.GETPROFILE);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
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