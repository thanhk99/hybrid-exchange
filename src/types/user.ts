export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  balance?: number;
  totalAssets?: number;
  level?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface UserContextType {
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  clearError: () => void;
}
