import { KEY_CONFIG } from "../lib/constants"

export default class deviceService {
    static async setDeviceId(id:string){
        localStorage.setItem(KEY_CONFIG.DEVICE_ID_KEY,id);
    }
    
    static async getDeviceId(){
        return localStorage.getItem(KEY_CONFIG.DEVICE_ID_KEY);
    }

    static async clearDeviceId(){
        
    }
}