// types/redux.ts (tạo file mới hoặc thêm vào file types)
export interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  userId: string | null;
}

export interface RootState {
  auth: AuthState;
}