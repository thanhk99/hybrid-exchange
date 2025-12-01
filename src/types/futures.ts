export interface FuturesCoin {
    symbol: string;
    markPrice: number;
    indexPrice: number;
    lastPrice: number;
    priceChange24h: number;
    volume24h: number;
    fundingRate: number;
    nextFundingTime: string;
    logoUrl?: string;
    // New fields for UI
    marketCap?: number;
    high24h?: number;
    low24h?: number;
    openInterest?: number;
    turnover24h?: number; // Giá trị 24h
}

export interface FuturesOrderRequest {
    symbol: string;
    side: 'BUY' | 'SELL';
    positionSide: 'LONG' | 'SHORT';
    type: 'LIMIT' | 'MARKET';
    price?: number;
    quantity: number;
    leverage: number;
}

export interface ClosePositionRequest {
    symbol: string;
}

export interface AdjustLeverageRequest {
    symbol: string;
    leverage: number;
}
