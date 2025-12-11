import { AxiosResponse } from "axios";
import axiosInstance from "../libs/axios";
import { ApiResponse } from "../types/common";

export interface Currency {
    id: string;
    symbol: string;
    name: string;
    icon?: string;
    networks?: Network[];
}

export interface Network {
    id: string;
    name: string;
    protocol: string;
    isDefault: boolean;
    fee?: string;
    minDeposit?: string;
    confirmations?: number;
    estimatedTime?: string;
}

export interface DepositAddress {
    address: string;
    tag?: string; // For XRP, EOS, etc.
    network: string;
    currency: string;
}

export interface Transaction {
    id: string;
    type: 'deposit' | 'withdraw' | 'transfer';
    currency: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    date: string;
    recipient?: string; // for transfers
    address?: string; // for deposit/withdraw
    network?: string; // for deposit/withdraw
    txHash?: string; // blockchain transaction hash
}

// Mock data for now, replace with API calls later
const MOCK_CURRENCIES: Currency[] = [
    {
        id: "usdt",
        symbol: "USDT",
        name: "Tether",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
        networks: [
            {
                id: "trc20",
                name: "TRC20",
                protocol: "TRON",
                isDefault: true,
                fee: "0 USDT",
                minDeposit: "1 USDT",
                confirmations: 19,
                estimatedTime: "1-3 phút"
            },
            {
                id: "erc20",
                name: "ERC20",
                protocol: "Ethereum",
                isDefault: false,
                fee: "0 USDT",
                minDeposit: "10 USDT",
                confirmations: 12,
                estimatedTime: "5-10 phút"
            },
            {
                id: "bep20",
                name: "BEP20",
                protocol: "BSC",
                isDefault: false,
                fee: "0 USDT",
                minDeposit: "1 USDT",
                confirmations: 15,
                estimatedTime: "2-5 phút"
            },
        ]
    },
    {
        id: "btc",
        symbol: "BTC",
        name: "Bitcoin",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
        networks: [
            {
                id: "btc",
                name: "Bitcoin",
                protocol: "Bitcoin",
                isDefault: true,
                fee: "0 BTC",
                minDeposit: "0.0001 BTC",
                confirmations: 2,
                estimatedTime: "10-30 phút"
            },
        ]
    },
    {
        id: "eth",
        symbol: "ETH",
        name: "Ethereum",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
        networks: [
            {
                id: "erc20",
                name: "ERC20",
                protocol: "Ethereum",
                isDefault: true,
                fee: "0 ETH",
                minDeposit: "0.01 ETH",
                confirmations: 12,
                estimatedTime: "5-10 phút"
            },
            {
                id: "bep20",
                name: "BEP20",
                protocol: "BSC",
                isDefault: false,
                fee: "0 ETH",
                minDeposit: "0.01 ETH",
                confirmations: 15,
                estimatedTime: "2-5 phút"
            },
        ]
    },
    {
        id: "bnb",
        symbol: "BNB",
        name: "BNB",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
        networks: [
            {
                id: "bep20",
                name: "BEP20",
                protocol: "BSC",
                isDefault: true,
                fee: "0 BNB",
                minDeposit: "0.01 BNB",
                confirmations: 15,
                estimatedTime: "2-5 phút"
            },
        ]
    },
    {
        id: "xrp",
        symbol: "XRP",
        name: "Ripple",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
        networks: [
            {
                id: "xrp",
                name: "XRP",
                protocol: "Ripple",
                isDefault: true,
                fee: "0 XRP",
                minDeposit: "1 XRP",
                confirmations: 1,
                estimatedTime: "1-2 phút"
            },
        ]
    },
    {
        id: "ada",
        symbol: "ADA",
        name: "Cardano",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png",
        networks: [
            {
                id: "ada",
                name: "Cardano",
                protocol: "Cardano",
                isDefault: true,
                fee: "0 ADA",
                minDeposit: "1 ADA",
                confirmations: 15,
                estimatedTime: "5-10 phút"
            },
        ]
    },
    {
        id: "sol",
        symbol: "SOL",
        name: "Solana",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
        networks: [
            {
                id: "sol",
                name: "Solana",
                protocol: "Solana",
                isDefault: true,
                fee: "0 SOL",
                minDeposit: "0.01 SOL",
                confirmations: 1,
                estimatedTime: "1-2 phút"
            },
        ]
    },
    {
        id: "trx",
        symbol: "TRX",
        name: "TRON",
        icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png",
        networks: [
            {
                id: "trc20",
                name: "TRON (TRC20)",
                protocol: "TRON",
                isDefault: true,
                fee: "0 TRX",
                minDeposit: "10 TRX",
                confirmations: 1,
                estimatedTime: "1-2 phút"
            }
        ]
    },
];

export interface InternalTransferRequest {
    recipientIdentifier: string; // UID, Email, or Phone
    currency: string;
    amount: number;
}

export interface WalletTransferRequest {
    fromWallet: 'FUNDING' | 'SPOT' | 'EARN' | 'FUTURES';
    toWallet: 'FUNDING' | 'SPOT' | 'EARN' | 'FUTURES';
    currency: string;
    amount: number;
}

export interface SwapRequest {
    fromCoin: string;
    toCoin: string;
    amount: number;
}

export interface SwapResponse {
    fromCoin: string;
    toCoin: string;
    sentAmount: number;
    receivedAmount: number;
    rate: number;
}

export default class WalletService {
    static async getCurrencies(): Promise<Currency[]> {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => resolve(MOCK_CURRENCIES), 500);
        });
    }

    static async getDepositAddress(currency: string, network: string): Promise<DepositAddress> {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    address: `0x${Math.random().toString(16).slice(2)}...mock_address_for_${currency}_${network}`,
                    network,
                    currency
                });
            }, 1000);
        });
    }

    static async getBalance(currency: string): Promise<number> {
        // Simulate API call - return mock balance
        return new Promise((resolve) => {
            setTimeout(() => {
                // Random balance between 100 and 10000
                const balance = Math.random() * 9900 + 100;
                resolve(parseFloat(balance.toFixed(2)));
            }, 500);
        });
    }

    static async transfer(recipient: string, currency: string, amount: number): Promise<void> {
        // Legacy method, keeping for compatibility if needed, but should use transferInternal
        return this.transferInternal({
            recipientIdentifier: recipient,
            currency,
            amount
        }).then(() => { });
    }

    /**
     * Internal Transfer (User to User)
     */
    static async transferInternal(data: InternalTransferRequest): Promise<AxiosResponse<ApiResponse<any>>> {
        try {
            const response = await axiosInstance.post<ApiResponse<any>>('api/v1/transfer/internal', data);
            return response;
        } catch (error) {
            console.error('Internal transfer error:', error);
            throw error;
        }
    }

    /**
     * Wallet Transfer (Between own wallets)
     */
    static async transferWallet(data: WalletTransferRequest): Promise<AxiosResponse<ApiResponse<any>>> {
        try {
            const response = await axiosInstance.post<ApiResponse<any>>('api/v1/transfer/wallet', data);
            return response;
        } catch (error) {
            console.error('Wallet transfer error:', error);
            throw error;
        }
    }

    /**
     * Swap Coins
     */
    static async swap(data: SwapRequest): Promise<AxiosResponse<ApiResponse<SwapResponse>>> {
        try {
            const response = await axiosInstance.post<ApiResponse<SwapResponse>>('api/v1/swap', data);
            return response;
        } catch (error) {
            console.error('Swap error:', error);
            throw error;
        }
    }

    /**
     * Manual Price Update
     */
    static async updateCoinPrices(): Promise<AxiosResponse<ApiResponse<any>>> {
        try {
            const response = await axiosInstance.post<ApiResponse<any>>('api/v1/coin/update-prices', {});
            return response;
        } catch (error) {
            console.error('Update prices error:', error);
            throw error;
        }
    }

    static async withdraw(address: string, currency: string, network: string, amount: number): Promise<void> {
        // Simulate API call for withdrawal
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success
                console.log(`Withdraw ${amount} ${currency} to ${address} via ${network}`);
                resolve();
            }, 2000);
        });
    }

    static async validateAddress(address: string, network: string): Promise<boolean> {
        // Simulate address validation
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simple validation - just check if address is not empty and has minimum length
                resolve(address.length >= 20);
            }, 300);
        });
    }

    static async getTransactionHistory(type?: 'deposit' | 'withdraw' | 'transfer'): Promise<Transaction[]> {
        // Simulate API call - return mock transaction history
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockTransactions: Transaction[] = [
                    {
                        id: 'tx1',
                        type: 'deposit',
                        currency: 'USDT',
                        amount: 1000,
                        status: 'completed',
                        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                        network: 'TRC20',
                        address: 'TXa...b3c',
                        txHash: '0x123...abc'
                    },
                    {
                        id: 'tx2',
                        type: 'transfer',
                        currency: 'BTC',
                        amount: 0.05,
                        status: 'completed',
                        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                        recipient: 'user@example.com'
                    },
                    {
                        id: 'tx3',
                        type: 'withdraw',
                        currency: 'ETH',
                        amount: 2.5,
                        status: 'pending',
                        date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                        network: 'ERC20',
                        address: '0xabc...def',
                        txHash: '0x456...def'
                    },
                    {
                        id: 'tx4',
                        type: 'deposit',
                        currency: 'BNB',
                        amount: 10,
                        status: 'completed',
                        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                        network: 'BEP20',
                        address: '0x789...ghi',
                        txHash: '0x789...ghi'
                    },
                    {
                        id: 'tx5',
                        type: 'transfer',
                        currency: 'USDT',
                        amount: 500,
                        status: 'completed',
                        date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
                        recipient: 'john@example.com'
                    },
                    {
                        id: 'tx6',
                        type: 'withdraw',
                        currency: 'BTC',
                        amount: 0.1,
                        status: 'failed',
                        date: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
                        network: 'Bitcoin',
                        address: '1A1z...P1e',
                        txHash: '0xabc...123'
                    },
                    {
                        id: 'tx7',
                        type: 'deposit',
                        currency: 'SOL',
                        amount: 50,
                        status: 'completed',
                        date: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
                        network: 'Solana',
                        address: 'So1...abc',
                        txHash: '0xsol...123'
                    },
                    {
                        id: 'tx8',
                        type: 'transfer',
                        currency: 'ETH',
                        amount: 1.2,
                        status: 'completed',
                        date: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
                        recipient: 'alice@example.com'
                    },
                    {
                        id: 'tx9',
                        type: 'withdraw',
                        currency: 'USDT',
                        amount: 2000,
                        status: 'completed',
                        date: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString(),
                        network: 'TRC20',
                        address: 'TXb...c4d',
                        txHash: '0x999...zzz'
                    },
                    {
                        id: 'tx10',
                        type: 'deposit',
                        currency: 'ADA',
                        amount: 1000,
                        status: 'completed',
                        date: new Date(Date.now() - 168 * 60 * 60 * 1000).toISOString(),
                        network: 'Cardano',
                        address: 'addr1...xyz',
                        txHash: '0xada...456'
                    },
                ];

                // Filter by type if specified
                const filtered = type
                    ? mockTransactions.filter(tx => tx.type === type)
                    : mockTransactions;

                resolve(filtered);
            }, 800);
        });
    }

    // Get exchange rate between two currencies
    static async getExchangeRate(fromCoin: string, toCoin: string): Promise<AxiosResponse<ApiResponse<{ rate: number }>>> {
        try {
            const response = await axiosInstance.get<ApiResponse<{ rate: number }>>(`/api/v1/coin/exchange-rate`, {
                params: { from: fromCoin, to: toCoin }
            });
            return response;
        } catch (error) {
            console.error('Get exchange rate error:', error);
            throw error;
        }
    }

    /**
     * TRON Custodial Wallet API
     */

    // Create/Get Tron Wallet Address
    static async getTronWallet(userId: string): Promise<{ userId: string; address: string }> {
        try {
            const response = await axiosInstance.post<{ userId: string; address: string }>(`/api/tron/wallet`, null, {
                params: { userId }
            });
            return response.data;
        } catch (error) {
            console.error('Get Tron wallet error:', error);
            throw error;
        }
    }

    // Send TRX (Custodial)
    static async sendTronTransfer(userId: string, toAddress: string, amount: number): Promise<any> {
        try {
            const response = await axiosInstance.post(`/api/tron/transfer`, {
                type: 'TRX',
                userId,
                toAddress,
                amount
            });
            return response.data;
        } catch (error) {
            console.error('Send Tron transfer error:', error);
            throw error;
        }
    }
}

