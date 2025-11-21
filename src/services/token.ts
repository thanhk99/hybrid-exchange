export default class TokenService {
  static ACCESS_TOKEN_KEY:string =process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || "accessToken"; 
  // Lấy access token
    static getAccessToken (key: string = 'accessToken'){
        if (typeof window === 'undefined') return null;
        
        try {
        return localStorage.getItem(key);
        } catch (error) {
        console.error('Error getting access token:', error);
        return null;
        }
    }

    // Lấy refresh token
    static getRefreshToken(key: string = 'refreshToken'){
        if (typeof window === 'undefined') return null;
        
        try {
        return localStorage.getItem(key);
        } catch (error) {
        console.error('Error getting refresh token:', error);
        return null;
        }
    }

    static isLogin(){
      if( localStorage.getItem(this.ACCESS_TOKEN_KEY) === null ||localStorage.getItem(this.ACCESS_TOKEN_KEY)  === ""){
          return false;
      }else{
          return true;
      }
    }
    // Set access token
    static setAccessToken(token: string, key: string = 'accessToken'){
        if (typeof window === 'undefined') return;
        
        try {
        localStorage.setItem(key, token);
        } catch (error) {
        console.error('Error setting access token:', error);
        }
    }

  // Set refresh token
    static setRefreshToken(token: string, key: string = 'refreshToken'){
        if (typeof window === 'undefined') return;
        
        try {
        localStorage.setItem(key, token);
        } catch (error) {
        console.error('Error setting refresh token:', error);
        }
    }

    // Set cả hai token
    static setToken(accessToken: string, refreshToken?: string){
        TokenService.setAccessToken(accessToken);
        if (refreshToken) {
        TokenService.setRefreshToken(refreshToken);
        }
    }

  // Xóa token
    static clearToken(key?: string){
        if (typeof window === 'undefined') return;
        
        try {
        if (key) {
            localStorage.removeItem(key);
        } else {
            // Xóa tất cả token liên quan
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            // Có thể thêm các key khác nếu cần
        }
        } catch (error) {
        console.error('Error clearing token:', error);
        }
    }

  // Kiểm tra đăng nhập
  isLogin(): boolean {
    return !!TokenService.getAccessToken();
  }

  // Kiểm tra token có hết hạn không (cơ bản)
  async isTokenExpired(): Promise<boolean> {
    const token = await TokenService.getAccessToken();
    if (!token) return true;

    try {
      // Giải mã JWT token để kiểm tra expiry
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true;
    }
  }

  // Lấy thông tin từ token (nếu là JWT)
  async getTokenPayload(): Promise<any> {
    const token = await TokenService.getAccessToken();
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
