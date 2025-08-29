// utils/axios.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AuthService from './springboot-api/auth';
import TokenService from './springboot-api/token';
import { store } from '../../store/store';
import { logout } from '../../store/authSlice';

const baseURL = 'http://localhost:8000';
const access_token_key ="a_tk"; 
let isRefreshing = false;
// Tạo instance Axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const clearAuthData = () => {
    // Xóa tất cả token từ localStorage
    TokenService.clearToken();
    
    // Dispatch logout action để clear Redux state
    store.dispatch(logout());
    
    // Redirect đến trang login
    if (typeof window !== 'undefined') {
        window.location.href = '/';
    }
};
// Thêm interceptor cho request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Thêm token vào header nếu có
    const token = localStorage.getItem(access_token_key); // Hoặc sử dụng cookie/store tùy bạn
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor cho response
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Xử lý response thành công
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Xử lý lỗi 403 và chưa từng thử refresh
    if (error.response?.status === 403 && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true; // Đánh dấu đã thử refresh
      isRefreshing = true;

      try {
            const response= await AuthService.refreshToken();
            TokenService.setToken(response.accessToken,response.refreshToken);
            TokenService.getAccess()
            
            // Retry các request đang chờ
            // originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            // Khi refresh token thất bại, xóa tất cả token và redirect
            clearAuthData();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
    
    // Xử lý các lỗi khác
    if (error.response) {
      switch (error.response.status) {
        case 401:
          clearAuthData();
          break;
        case 404:
          console.error('Resource not found');
          break;
        default:
          console.error('Server error:', error.response.status);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;