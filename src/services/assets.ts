import axiosInstance from '@/src/libs/axios';

export interface AssetOverviewResponse {
    funding: {
        assets: Array<{
            balance: number;
            valueUsd: number;
            currency: string;
            locked: number;
        }>;
        totalUsd: number;
    };
    spot: {
        assets: Array<{
            total: number;
            balance: number;
            valueUsd: number;
            currency: string;
            locked: number;
        }>;
        totalUsd: number;
    };
    earn: {
        assets: any[];
        totalUsd: number;
    };
    totalAssetUsd: number;
}

export const getAssetsOverview = async (): Promise<AssetOverviewResponse> => {
    // You can replace fetch with axiosInstance if needed
    const response = await fetch('/api/v1/assets/overview');
    if (!response.ok) {
        throw new Error('Failed to fetch assets overview');
    }
    const data = await response.json();
    return data as AssetOverviewResponse;
};
