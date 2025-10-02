import axiosInstance from "../axios";
import { API_CONFIG } from "../../constants";

class userService{

    static apiGetUser = API_CONFIG.ENDPOINTS.USER.GETFULLPROFILE;
    
    static async getUser(){
        const response = await axiosInstance.get(userService.apiGetUser);
        return response.data;
    }
}

export default userService;