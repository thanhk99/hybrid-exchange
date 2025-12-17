// src/contexts/UserContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import TokenService from "../services/token";
import UserService from "../services/user";
import { UserInfo, UserContextType } from "../types/user";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      let token = TokenService.getAccessToken();
      console.log('UserContext: fetchUser called. Token exists:', !!token);

      // Nếu không có access token (F5 trang), thử refresh token
      if (!token) {
        const refreshToken = TokenService.getRefreshToken();
        if (refreshToken) {
          try {
            console.log('UserContext: Attempting to refresh token...');
            const AuthService = (await import('../services/auth')).default;
            await AuthService.refreshToken();
            token = TokenService.getAccessToken();
            console.log('UserContext: Token refreshed successfully');
          } catch (refreshErr) {
            console.error('UserContext: Failed to refresh token:', refreshErr);
          }
        }
      }

      if (!token) {
        console.log('UserContext: No token, setting user to null');
        setUser(null);
        return;
      }

      const response = await UserService.getProfile();
      console.log('UserContext: API Response:', response);
      const userData = response?.data?.data ?? response?.data ?? null;
      console.log('UserContext: Parsed userData:', userData);
      setUser(userData);
    } catch (err: any) {
      console.error('Failed to fetch user:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Phiên đăng nhập đã hết hạn');
        TokenService.clearToken();
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError('Lỗi kết nối mạng');
      } else {
        setError(err.response?.data?.message || 'Không thể tải thông tin người dùng');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const AuthService = (await import('../services/auth')).default;
      const response = await AuthService.login({ email, password });

      if (response.data.accessToken) {
        TokenService.setToken(response.data.accessToken, response.data.refreshToken);
        await fetchUser();
        return { success: true, message: 'Đăng nhập thành công' };
      }
      throw new Error('No access token received');
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Đăng nhập thất bại';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchUser]);

  const logout = useCallback(() => {
    TokenService.clearToken();
    setUser(null);
    setError(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value: UserContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user && !!TokenService.getAccessToken(),
    refreshUser: fetchUser,
    login,
    logout,
    clearError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};