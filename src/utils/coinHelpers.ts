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

// Format Market Cap with Vietnamese abbreviations
export const formatMarketCap = (value: number): string => {
    if (value >= 1e12) {
        return (value / 1e12).toFixed(2) + ' NT';
    } else if (value >= 1e9) {
        return (value / 1e9).toFixed(2) + ' T';
    } else if (value >= 1e6) {
        return (value / 1e6).toFixed(2) + ' Tr';
    } else {
        return formatCurrency(value);
    }
};

/**
 * Chuẩn hóa symbol sang định dạng có dấu gạch ngang (DASH) dùng cho WebSocket topics
 * Ví dụ: BTC/USDT -> BTC-USDT, BTCUSDT -> BTC-USDT
 */
export const formatTopicSymbol = (symbol: string): string => {
    if (!symbol) return '';

    // Nếu có gạch chéo, thay bằng gạch ngang
    if (symbol.includes('/')) {
        return symbol.replace(/\//g, '-').toUpperCase();
    }

    // Nếu là dạng BTCUSDT (không có phân tách), chèn gạch ngang trước USDT
    if (symbol.endsWith('USDT') && !symbol.includes('-')) {
        return symbol.replace('USDT', '-USDT').toUpperCase();
    }

    return symbol.toUpperCase();
};
