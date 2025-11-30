import axiosInstance from '../libs/axios';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '../types/common';

export interface DeviceInfo {
    deviceId: string;
    deviceName: string;
    deviceType: string;
    ipAddress: string;
    location: string;
    lastLogin: string;
    browser: string;
    isCurrent?: boolean; // Optional, might be added by frontend or backend later
}

export default class DeviceService {
    /**
     * Get list of logged-in devices
     * @returns List of devices
     */
    static async listDevices(): Promise<AxiosResponse<ApiResponse<DeviceInfo[]>>> {
        try {
            const response = await axiosInstance.get<ApiResponse<DeviceInfo[]>>('api/v1/device/listDevice');
            return response;
        } catch (error) {
            console.error('List devices error:', error);
            throw error;
        }
    }

    /**
     * Revoke (logout) a specific device
     * @param deviceId - ID of the device to revoke
     * @returns API response
     */
    static async revokeDevice(deviceId: string): Promise<AxiosResponse<ApiResponse<any>>> {
        try {
            const response = await axiosInstance.post<ApiResponse<any>>('api/v1/device/revoke', { deviceId });
            return response;
        } catch (error) {
            console.error('Revoke device error:', error);
            throw error;
        }
    }
}
