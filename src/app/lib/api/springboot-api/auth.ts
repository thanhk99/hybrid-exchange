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
        return axiosInstance.post(AuthService.apiLogin,body);
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
        const refreshToken = TokenService.getRefresh()
        const body={
            refreshToken:refreshToken
        }
        const response=await axiosInstance.post(AuthService.apiRefreshToken,body);
        return response.data;
    }
}

export default AuthService