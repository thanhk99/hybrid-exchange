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
    futures: {
        totalUsd: number;
        asset: {
            currency: string;
            balance: number;
            lockedBalance: number;
            availableBalance: number;
            unrealizedPnl: number;
            totalPositionValue: number;
            marginRatio: number;
            openPositionsCount: number;
            totalValue: number;
            valueUsd: number;
        };
    };
    totalAssetUsd: number;
}