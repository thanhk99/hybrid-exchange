export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  nation: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  //   user: any;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}
