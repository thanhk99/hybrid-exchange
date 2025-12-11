import { deleteCookie, getCookie, setCookie } from 'cookies-next';

export default class TokenService {
  private static _accessToken: string | null = null;
  static ACCESS_TOKEN_KEY: string = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || "accessToken";
  static REFRESH_TOKEN_KEY: string = "refreshToken";

  // Lấy access token (Memory -> Cookie)
  static getAccessToken() {
    if (this._accessToken) return this._accessToken;

    // Nếu không có trong memory, thử tìm trong cookie
    const tokenFromCookie = getCookie(this.ACCESS_TOKEN_KEY);
    if (tokenFromCookie) {
      this._accessToken = tokenFromCookie.toString();
      return this._accessToken;
    }

    return null;
  }

  // Set access token (Memory & Cookie)
  static setAccessToken(token: string) {
    this._accessToken = token;
    setCookie(this.ACCESS_TOKEN_KEY, token, {
      maxAge: 1 * 60 * 60, // 1 hour (hoặc check payload.exp)
      path: '/',
      sameSite: 'lax',
    });
  }

  // Lấy refresh token (Cookie)
  static getRefreshToken() {
    return getCookie(this.REFRESH_TOKEN_KEY)?.toString() || null;
  }

  // Set refresh token (Cookie)
  static setRefreshToken(token: string) {
    setCookie(this.REFRESH_TOKEN_KEY, token, {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
      sameSite: 'lax',
      // secure: process.env.NODE_ENV === 'production' // Uncomment for https in prod
    });
  }

  static isLogin() {
    return !!this._accessToken;
  }

  // Set cả hai token
  static setToken(accessToken: string, refreshToken?: string) {
    this.setAccessToken(accessToken);
    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }
  }

  // Xóa token
  static clearToken() {
    this._accessToken = null;
    deleteCookie(this.REFRESH_TOKEN_KEY, { path: '/' });

    // Clear any old local storage if exists
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      // Clear old cookies just in case
      deleteCookie(this.ACCESS_TOKEN_KEY, { path: '/' });
    }
  }

  // Kiểm tra token có hết hạn không
  static async isTokenExpired(): Promise<boolean> {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true;
    }
  }

  // Lấy thông tin từ token
  static async getTokenPayload(): Promise<any> {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Error parsing token payload:', error);
      return null;
    }
  }
}
