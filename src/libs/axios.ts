import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import TokenService from "../services/token";
import { store } from "../app/store/store";
import { logout, updateTokens } from "../app/store/authSlice";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000;
const ACCESS_TOKEN_KEY = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || "accessToken";
const REFRESH_ENDPOINT = process.env.NEXT_PUBLIC_REFRESH_ENDPOINT || "/api/v1/auth/refresh";

// Helper to handle redirect
const redirectToLogin = () => {
  if (typeof window !== "undefined" && !window.location.pathname.includes('/login')) {
    // window.location.href = "/login"; // Disabled for debugging as requested
    console.log('Redirect to login requested but disabled.');
  }
};

// Clear token helper
const clearAuthData = () => {
  TokenService.clearToken();
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
  withCredentials: true, // Important for HttpOnly cookies
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = TokenService.getAccessToken();

    // Check for custom header to skip auth
    const isPublicEndpoint = config.headers && config.headers['x-no-auth'] === 'true';

    if (isPublicEndpoint) {
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

// Response interceptor variables
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    if (!status) return Promise.reject(error);

    // If 401 and not retried yet
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      // If the failed request is the refresh token request itself, don't retry
      if (originalRequest.url?.includes(REFRESH_ENDPOINT)) {
        clearAuthData();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const AuthService = (await import("../services/auth")).default;
        // Call refresh logic
        const refreshResponse = await AuthService.refreshToken(REFRESH_ENDPOINT);
        const newToken = refreshResponse?.data?.accessToken;

        if (!newToken) {
          throw new Error('No access token returned from refresh');
        }

        // Update Redux state
        store.dispatch(updateTokens({
          accessToken: newToken,
          refreshToken: refreshResponse?.data?.refreshToken || null
        }));

        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);
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
