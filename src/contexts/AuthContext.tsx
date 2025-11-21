// contexts/UserContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import TokenService from "../services/token";
import UserService from "../services/user";
import { UserInfo } from "../types/user";

interface UserContextType {
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Fetch user info
  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const token = TokenService.getAccessToken();
      if (!token) {
        setUser(null);
        return;
      }

      const response = await UserService.getProfile();
      
      if (response?.data) {
        setUser(response.data);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Phiên đăng nhập đã hết hạn');
        TokenService.clearToken();
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setError('Lỗi kết nối mạng');
      } else {
        setError(error.response?.data?.message || 'Không thể tải thông tin người dùng');
      }
      
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);

      const AuthService = (await import('../services/auth')).default;
      const response = await AuthService.login({ email, password });

      if (response.data.accessToken) {
        TokenService.setToken(
          response.data.accessToken,
          response.data.refreshToken
        );
        
        await fetchUser();
        
        return { 
          success: true, 
          message: 'Đăng nhập thành công' 
        };
      } else {
        throw new Error('No access token received');
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Đăng nhập thất bại';
      
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, [fetchUser]);

  // Logout function
  const logout = useCallback(() => {
    TokenService.clearToken();
    setUser(null);
    setError(null);
    
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  // Auto fetch user on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'refreshToken') {
        if (!e.newValue) {
          setUser(null);
        } else {
          fetchUser();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};