'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import TokenService from "../services/token";
import UserService from "../services/user";
import { UserContextType, UserInfo } from "../types/user";




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
      } else {
        setError(error.response?.data?.message || 'Không thể tải thông tin người dùng');
      }
      
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

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