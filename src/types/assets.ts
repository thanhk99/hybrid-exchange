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