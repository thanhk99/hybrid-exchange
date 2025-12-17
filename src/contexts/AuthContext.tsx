'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AuthService from '../services/auth';
import TokenService from '../services/token';
import UserService from '../services/user';
import { UserInfo } from '../types/user';
import { LoginData, RegisterData } from '../types/auth';

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await UserService.getProfile();
      const userData = response?.data?.data ?? response?.data ?? null;
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      // If fetching profile fails (likely 401), we might want to logout
      // but let's leave that to the axios interceptor or logic below
      setUser(null);
    }
  }, []);

  const initAuth = useCallback(async () => {
    setLoading(true);
    try {
      let token = TokenService.getAccessToken();

      // Nếu có token, kiểm tra xem còn hạn không
      if (token) {
        const isExpired = await TokenService.isTokenExpired();
        if (isExpired) {
          console.log('UserContext: Token expired, clearing...');
          token = null;
        }
      }

      if (!token) {
        const refreshToken = TokenService.getRefreshToken();
        if (refreshToken) {
          try {
            await AuthService.refreshToken();
            token = TokenService.getAccessToken();
          } catch (err) {
            console.log('Refresh token failed', err);
          }
        }
      }

      if (token) {
        await fetchUserProfile();
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth initialization error', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  // Auto-refresh token on mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      const response = await AuthService.login(data);
      if (response.data.accessToken) {
        // Token is already set in AuthService/TokenService inside login method? 
        // AuthService.login implementation in `services/auth.ts` calls TokenService.setToken
        // So we just need to fetch user.
        await fetchUserProfile();
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const authServiceInstance = new AuthService();
      await new AuthService().register(data);

      // Auto login after register? The snippet did it.
      // Let's try to login.
      await login({ email: data.email, password: data.password });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      await new AuthService().logout();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setUser(null);
      TokenService.clearToken();
      window.location.href = '/login';
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    refreshUser: fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};