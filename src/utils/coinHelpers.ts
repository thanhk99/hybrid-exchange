// Helper function to get coin icon path
export const getCoinIcon = (symbol: string): string => {
    const coinMap: Record<string, string> = {
        'BTC': '/imgs/coin/bitcoin.png',
        'ETH': '/imgs/coin/ethereum.png',
        'USDT': '/imgs/coin/tether.png',
        'BNB': '/imgs/coin/bnb.png',
        'SOL': '/imgs/coin/solana.png',
        'ADA': '/imgs/coin/cardano.png',
        'DOT': '/imgs/coin/polkadot.png',
        'DOGE': '/imgs/coin/dogecoin.png',
        'MATIC': '/imgs/coin/polygon.png',
        'LTC': '/imgs/coin/litecoin.png',
        'AVAX': '/imgs/coin/avalanche.png',
        'TRX': '/imgs/coin/tron.png',
        'XRP': '/imgs/coin/xrp.png',
    };

    return coinMap[symbol.toUpperCase()] || '/imgs/coin/bitcoin.png'; // fallback to bitcoin
};

// Format currency symbol for display
export const formatCurrency = (value: number, decimals: number = 2): string => {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
};

// Format crypto amount
export const formatCrypto = (value: number): string => {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 8
    });
};
