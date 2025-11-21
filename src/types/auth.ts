interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
//   user: any;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}
