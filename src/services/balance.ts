import axiosInstance from '@/src/libs/axios';
import { AssetOverviewResponse } from '@/src/types/assets';

interface ApiResponse<T> {
    message: string;
    data: T;
}

export const getAssetsOverview = async (): Promise<AssetOverviewResponse> => {
    const response = await axiosInstance.get<ApiResponse<AssetOverviewResponse>>('/api/v1/assets/overview');
    if (!response.data || !response.data.data) {
        throw new Error('Failed to fetch assets overview');
    }
    return response.data.data;
};
