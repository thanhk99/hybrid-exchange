import axiosInstance from '../libs/axios';
import TokenService from './token';


export default class AuthService {

  static api_login:string = process.env.NEXT_PUBLIC_API_BASE_URL +"/api/v1/auth/login"

  static async login(loginData: LoginData){
    try {
      const response = await axiosInstance.post(this.api_login, loginData);
      
      if (response.data.accessToken) {
        TokenService.setToken(
          response.data.accessToken,
          response.data.refreshToken
        );
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Đăng ký
  async register(registerData: RegisterData): Promise<any> {
    try {
      const response = await axiosInstance.post('/auth/register', registerData);
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // Refresh token
  static refreshToken = async(endpoint: string = '/auth/refresh-token')=>{
    try{
      const refreshToken = TokenService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axiosInstance.post(endpoint, {
        refreshToken
      });

      if (response.data.accessToken) {
        TokenService.setAccessToken(response.data.accessToken);
        
        if (response.data.refreshToken) {
          TokenService.setRefreshToken(response.data.refreshToken);
        }
      }

      return response;
    }
    catch (error) {
      console.error('Refresh token error:', error);
      
      // Clear token nếu refresh thất bại
      TokenService.clearToken();
      throw error;
    }
  }
  // Đăng xuất
  async logout(): Promise<void> {
    try {
      // Gọi API logout nếu cần
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Luôn clear token dù API có thành công hay không
      TokenService.clearToken();
    }
  }

  // Quên mật khẩu
  async forgotPassword(email: string): Promise<any> {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Đặt lại mật khẩu
  async resetPassword(token: string, newPassword: string): Promise<any> {
    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        token,
        newPassword
      });
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Đổi mật khẩu
  async changePassword(currentPassword: string, newPassword: string): Promise<any> {
    try {
      const response = await axiosInstance.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Verify email
  async verifyEmail(token: string): Promise<any> {
    try {
      const response = await axiosInstance.post('/auth/verify-email', { token });
      return response;
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    }
  }

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<any> {
    try {
      const response = await axiosInstance.post('/auth/resend-verification', { email });
      return response;
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  }

  // Kiểm tra trạng thái auth
  async checkAuth(): Promise<any> {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response;
    } catch (error) {
      console.error('Check auth error:', error);
      throw error;
    }
  }
}
