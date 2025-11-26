import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import AuthService from "../services/auth";
import TokenService from "../services/token";
import { store } from "../app/store/store";
import { logout } from "../app/store/authSlice";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000;
const ACCESS_TOKEN_KEY = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || "accessToken";
const REFRESH_ENDPOINT = process.env.NEXT_PUBLIC_REFRESH_ENDPOINT || "/api/v1/auth/refresh";

let isRefreshing = false;

let failedRequestsQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

// Redirect an toàn (client-only)
const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

// Clear token
const clearAuthData = () => {
  TokenService.clearToken(ACCESS_TOKEN_KEY);

  // Dispatch logout action to clear Redux store
  store.dispatch(logout());

  if (typeof window !== "undefined") {
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
  }
  redirectToLogin();
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---- REQUEST INTERCEPTOR ----
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = TokenService.getAccessToken(ACCESS_TOKEN_KEY);

    // Check for custom header to skip auth
    const isPublicEndpoint = config.headers && config.headers['x-no-auth'] === 'true';

    if (isPublicEndpoint) {
      // Remove the custom header before sending request
      if (config.headers) {
        delete config.headers['x-no-auth'];
      }
    } else if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ---- RESPONSE INTERCEPTOR ----
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    if (!status) return Promise.reject(error);

    // ====== TOKEN EXPIRED ======
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      // If the failed request is the refresh token request itself, don't retry
      if (originalRequest.url?.includes(REFRESH_ENDPOINT)) {
        clearAuthData();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await AuthService.refreshToken(REFRESH_ENDPOINT);

        const newToken = refreshResponse?.data?.accessToken;
        if (!newToken) {
          clearAuthData();
          return Promise.reject(error);
        }

        TokenService.setAccessToken(newToken, ACCESS_TOKEN_KEY);

        // Xử lý các request đang chờ
        failedRequestsQueue.forEach((req) => req.resolve(newToken));
        failedRequestsQueue = [];

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        failedRequestsQueue.forEach((req) => req.reject(refreshError));
        failedRequestsQueue = [];
        clearAuthData();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
