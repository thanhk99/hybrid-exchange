export interface Asset {
    symbol: string;
    name: string;
    balance: number;
    usdValue: number;
    available?: number;
    locked?: number;
    change24h?: number;
}

export interface WalletData {
    type: 'funding' | 'spot' | 'earn';
    totalUsd: number;
    assets: Asset[];
}

export interface BalanceOverview {
    totalAssetUsd: number;
    funding: WalletData;
    spot: WalletData;
    earn: WalletData;
}

export interface ActionButton {
    label: string;
    onClick: () => void;
}
