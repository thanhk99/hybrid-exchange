import axiosInstance from '../libs/axios';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '../types/common';

export interface PasswordRequest {
    oldPassword?: string;
    newPassword?: string;
    oldLv2Password?: string;
    newLv2Password?: string;
}

export default class PasswordService {
    static async changePassword(data: PasswordRequest): Promise<AxiosResponse<ApiResponse<any>>> {
        try {
            const response = await axiosInstance.post<ApiResponse<any>>('api/v1/password/changePass', data);
            return response;
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    }
}
