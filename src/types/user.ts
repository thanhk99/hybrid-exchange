export interface UserInfo {
  uid: string;
  email: string;
  username: string;
  nation: string;
  kycStatus: 'NONE' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  phone: string | null;
  userLevel: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  userStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  avatar?: string;
  balance?: number;
  totalAssets?: number;
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
