// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import TokenService from "../services/token";
import UserService from "../services/user";
import { UserInfo } from "../types/user";

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Try to get access token from memory
      let token = TokenService.getAccessToken();

      // If no access token in memory, check if we have a refresh token in cookies
      if (!token) {
        const refreshToken = TokenService.getRefreshToken();
        if (refreshToken) {
          try {
            // Import AuthService dynamically to avoid circular dependency if any
            const AuthService = (await import('../services/auth')).default;
            // Attempt to refresh the token
            await AuthService.refreshToken();
            // Get the new token
            token = TokenService.getAccessToken();
          } catch (refreshError) {
            console.error('Failed to refresh token on init:', refreshError);
            // If refresh fails, clear everything
            TokenService.clearToken();
          }
        }
      }

      if (!token) {
        setUser(null);
        return;
      }

      const response = await UserService.getProfile();
      // Assuming API returns { data: UserInfo }
      const userData = response?.data?.data ?? response?.data ?? null;
      setUser(userData);
    } catch (err: any) {
      console.error('Failed to fetch user:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Only try to refresh if we haven't just tried (simple check)
        // ideally we rely on axios interceptor for 401s during API calls, 
        // but this is initial load.
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

  // Sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Since accessToken is no longer in local storage, we mostly care about explicit logout signals 
      // or if logic puts something else in storage. 
      // But typically with memory + cookie, storage events are less relevant for the access token itself.
      // We might track 'refreshToken' if we sync it to local storage (we don't anymore),
      // OR if another tab clears storage.
      // Let's keep it listening for general clears or custom events if needed.
      if (e.key === TokenService.REFRESH_TOKEN_KEY) { // Check against the key constant if possible, or just ignore for now as we use cookies
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

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user && !!TokenService.getAccessToken(),
    refreshUser: fetchUser,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};