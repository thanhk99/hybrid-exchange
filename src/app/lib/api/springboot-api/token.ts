import { KEY_CONFIG } from "../../constants"

export default class TokenService{

    static ACCESS_TOKEN_KEY = KEY_CONFIG.ACCESS_TOKEN_KEY;
    static REFRESH_TOKEN_KEY = KEY_CONFIG.REFRESH_TOKEN_KEY

    static async setToken(access:any, refresh:any){
        localStorage.setItem(this.ACCESS_TOKEN_KEY,access)
        localStorage.setItem(this.REFRESH_TOKEN_KEY,refresh)
    }

    static async clearToken(){
        localStorage.clear()
    }

    static async getRefresh() : Promise<string | null>{
        return localStorage.getItem(this.REFRESH_TOKEN_KEY)
    }

    static async getAccess(){
        return localStorage.getItem(this.ACCESS_TOKEN_KEY)
    }

    static isLogin(){
        if( localStorage.getItem(this.ACCESS_TOKEN_KEY) === null ||localStorage.getItem(this.ACCESS_TOKEN_KEY)  === ""){
            return false;
        }else{
            return true;
        }
    }
}