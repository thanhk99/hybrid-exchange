import axiosInstance  from "../axios";
import { API_CONFIG } from "../../constants";
import TokenService from "./token";

class AuthService{

    static apiLogin:string =API_CONFIG.ENDPOINTS.AUTH.LOGIN;
    static apiRefreshToken :string =API_CONFIG.ENDPOINTS.AUTH.REFRESH

    static async login(email:any,password:any){
        const body={
            email:email,
            password:password
        }
        const response=await axiosInstance.post(AuthService.apiLogin,body);
        return response.data;
    }

    static async refreshToken(){
        const refreshToken = TokenService.getRefresh()
        const body={
            refreshToken:refreshToken
        }
        const response=await axiosInstance.post(AuthService.apiRefreshToken,body);
        return response.data;
    }
}

export default AuthService