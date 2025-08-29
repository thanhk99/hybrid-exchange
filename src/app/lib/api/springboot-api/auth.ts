import axiosInstance  from "../axios";
import { API_CONFIG } from "../../constants";
import TokenService from "./token";

class AuthService{

    static apiLogin:string =API_CONFIG.ENDPOINTS.AUTH.LOGIN;
    static apiRefreshToken :string =API_CONFIG.ENDPOINTS.AUTH.REFRESH
    static aoiSignUp : string = API_CONFIG.ENDPOINTS.AUTH.SIGNUP

    static login(email:any,password:any){
        const body={
            email:email,
            password:password
        }
        const response =  axiosInstance.post(AuthService.apiLogin,body);
        return response
    }

    static signup (email : any, username : any, password : any, nation: any){
        const body ={
            email : email,
            username : username,
            password : password,
            nation : nation
        }
        return axiosInstance.post(AuthService.aoiSignUp,body);
    }

    static async refreshToken(){
        const refreshToken = await TokenService.getRefresh()
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }
        
        console.log('Attempting to refresh token with:', refreshToken.substring(0, 20) + '...');
        
        // Chỉ sử dụng JSON format vì backend chỉ support application/json
        const body = {
            refreshToken: refreshToken
        };
        
        console.log('Refresh token request body:', body);
        
        try {
            const response = await axiosInstance.post(AuthService.apiRefreshToken, body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Refresh token response:', response);
            return response.data;
        } catch (error: any) {
            console.error('Refresh token failed:', error.response?.status, error.response?.data);
            throw error;
        }
    }
}

export default AuthService