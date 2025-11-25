import {
    P2POrder,
    P2PTrade,
    TradeMessage,
    UserP2PStats,
    P2PFilters,
    PaymentMethod,
    OrderType
} from '@/src/types/p2p';
import axiosInstance from '@/src/libs/axios';

// Mock payment methods
const PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: 'bank_1',
        type: 'bank_transfer',
        name: 'Chuyển khoản ngân hàng',
        icon: '🏦',
        accountName: 'Nguyen Van A',
        accountNumber: '1234567890'
    },
    {
        id: 'momo_1',
        type: 'momo',
        name: 'Momo',
        icon: '📱',
        accountName: 'Nguyen Van A',
        accountNumber: '0901234567'
    },
    {
        id: 'zalopay_1',
        type: 'zalopay',
        name: 'ZaloPay',
        icon: '💳',
        accountName: 'Nguyen Van A',
        accountNumber: '0901234567'
    },
    {
        id: 'viettel_1',
        type: 'viettel_pay',
        name: 'ViettelPay',
        icon: '📲',
        accountName: 'Nguyen Van A',
        accountNumber: '0901234567'
    }
];

// Mock orders
const MOCK_ORDERS: P2POrder[] = [
    {
        id: 'order_1',
        type: 'sell',
        merchantId: 'user_1',
        merchantName: 'CryptoTrader99',
        merchantRating: 4.8,
        merchantCompletedTrades: 1234,
        merchantCompletionRate: 98.5,
        currency: 'USDT',
        fiatCurrency: 'VND',
        price: 25350,
        minLimit: 500000,
        maxLimit: 50000000,
        availableAmount: 10000,
        paymentMethods: [PAYMENT_METHODS[0], PAYMENT_METHODS[1]],
        terms: 'Vui lòng thanh toán trong vòng 15 phút',
        status: 'active',
        createdAt: new Date().toISOString()
    },
    {
        id: 'order_2',
        type: 'buy',
        merchantId: 'user_2',
        merchantName: 'BitcoinMaster',
        merchantRating: 4.9,
        merchantCompletedTrades: 856,
        merchantCompletionRate: 99.2,
        currency: 'BTC',
        fiatCurrency: 'VND',
        price: 2350000000,
        minLimit: 10000000,
        maxLimit: 500000000,
        availableAmount: 0.5,
        paymentMethods: [PAYMENT_METHODS[0], PAYMENT_METHODS[2], PAYMENT_METHODS[3]],
        status: 'active',
        createdAt: new Date().toISOString()
    },
    {
        id: 'order_3',
        type: 'sell',
        merchantId: 'user_3',
        merchantName: 'EthereumPro',
        merchantRating: 4.7,
        merchantCompletedTrades: 567,
        merchantCompletionRate: 97.8,
        currency: 'ETH',
        fiatCurrency: 'VND',
        price: 85000000,
        minLimit: 1000000,
        maxLimit: 100000000,
        availableAmount: 5,
        paymentMethods: [PAYMENT_METHODS[1], PAYMENT_METHODS[2]],
        status: 'active',
        createdAt: new Date().toISOString()
    }
];

class P2PService {
    /**
     * Get P2P orders with filters
     */
    async getOrders(filters: P2PFilters): Promise<P2POrder[]> {
        try {
            // Call API based on trade type
            const endpoint = `/api/v1/p2pads/getList/${filters.type.toUpperCase()}`;
            const response = await axiosInstance.get(endpoint);

            console.log('P2P orders response:', response.data);

            const apiData = response.data.data || response.data;

            if (!Array.isArray(apiData)) {
                console.error('API response is not an array:', apiData);
                return [];
            }

            // Map API response to frontend format
            let orders: P2POrder[] = apiData.map((item: any) => ({
                id: item.id?.toString() || `order_${Date.now()}`,
                type: item.tradeType?.toLowerCase() as OrderType,
                merchantId: item.uid || 'unknown',
                merchantName: item.name || 'Unknown User',
                merchantRating: item.percentLike || 0,
                merchantCompletedTrades: item.totalTransfer || 0,
                merchantCompletionRate: item.percentComplete || 0,
                currency: item.asset,
                fiatCurrency: item.fiatCurrency,
                price: item.price,
                minLimit: item.minAmount,
                maxLimit: item.maxAmount,
                availableAmount: item.availableAmount,
                paymentMethods: (item.paymentMethods || []).map((pm: string) => {
                    // Map backend payment method names to frontend format
                    const typeMap: Record<string, string> = {
                        'BankTransfer': 'bank_transfer',
                        'Momo': 'momo',
                        'ZaloPay': 'zalopay',
                        'ViettelPay': 'viettel_pay'
                    };
                    const type = typeMap[pm] || pm.toLowerCase();
                    return PAYMENT_METHODS.find(m => m.type === type) || {
                        id: `${type}_${item.id}`,
                        type: type as any,
                        name: pm,
                        icon: '💳'
                    };
                }),
                terms: item.terms || '',
                status: 'active',
                createdAt: item.createdAt || new Date().toISOString()
            }));

            // Apply client-side filters
            if (filters.currency) {
                orders = orders.filter(order => order.currency === filters.currency);
            }

            if (filters.minAmount) {
                orders = orders.filter(order => order.maxLimit >= filters.minAmount!);
            }

            if (filters.maxAmount) {
                orders = orders.filter(order => order.minLimit <= filters.maxAmount!);
            }

            if (filters.paymentMethods && filters.paymentMethods.length > 0) {
                orders = orders.filter(order =>
                    order.paymentMethods.some(pm =>
                        filters.paymentMethods!.includes(pm.type)
                    )
                );
            }

            return orders;
        } catch (error: any) {
            console.error('Error fetching P2P orders:', error);
            // Return empty array on error instead of throwing
            return [];
        }
    }

    /**
     * Create a new P2P order
     */
    async createOrder(orderData: Partial<P2POrder>): Promise<P2POrder> {
        try {
            // Map frontend data to backend API format
            const requestBody = {
                tradeType: orderData.type?.toUpperCase(),
                asset: orderData.currency,
                fiatCurrency: orderData.fiatCurrency,
                price: orderData.price,
                minAmount: orderData.minLimit,
                maxAmount: orderData.maxLimit,
                availableAmount: orderData.availableAmount,
                paymentMethods: orderData.paymentMethods?.map(pm => {
                    const typeMap: Record<string, string> = {
                        'bank_transfer': 'BankTransfer',
                        'momo': 'Momo',
                        'zalopay': 'ZaloPay',
                        'viettel_pay': 'ViettelPay'
                    };
                    return typeMap[pm.type] || pm.type;
                }),
                terms: orderData.terms
            };

            console.log('Creating P2P order with data:', requestBody);

            const response = await axiosInstance.post('/api/v1/p2pads/create', requestBody);

            console.log('Response data:', response.data);

            const data = response.data;

            // Map backend response back to frontend format
            const newOrder: P2POrder = {
                id: data.id || `order_${Date.now()}`,
                type: (data.tradeType?.toLowerCase() || orderData.type) as OrderType,
                merchantId: 'current_user',
                merchantName: 'You',
                merchantRating: 5.0,
                merchantCompletedTrades: 0,
                merchantCompletionRate: 100,
                currency: data.asset || orderData.currency!,
                fiatCurrency: data.fiatCurrency || orderData.fiatCurrency!,
                price: data.price || orderData.price!,
                minLimit: data.minAmount || orderData.minLimit!,
                maxLimit: data.maxAmount || orderData.maxLimit!,
                availableAmount: data.availableAmount || orderData.availableAmount!,
                paymentMethods: orderData.paymentMethods!,
                terms: data.terms || orderData.terms,
                status: 'active',
                createdAt: data.createdAt || new Date().toISOString()
            };

            console.log('Created order:', newOrder);
            return newOrder;
        } catch (error: any) {
            console.error('Error creating P2P order:', error);
            console.error('Error response:', error.response);
            console.error('Error data:', error.response?.data);

            let errorMessage = 'Failed to create order';

            if (error.response?.status === 403) {
                errorMessage = error.response?.data?.message || 'Bạn không có quyền tạo quảng cáo P2P. Vui lòng kiểm tra tài khoản hoặc đăng nhập lại.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            throw new Error(errorMessage);
        }
    }

    /**
     * Create a trade from an order
     */
    async createTrade(order: P2POrder, amount: number, paymentMethodId: string): Promise<P2PTrade> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const paymentMethod = order.paymentMethods.find(pm => pm.id === paymentMethodId);

                if (!paymentMethod) {
                    throw new Error('Payment method not found');
                }

                const trade: P2PTrade = {
                    id: `trade_${Date.now()}`,
                    orderId: order.id,
                    order,
                    buyerId: order.type === 'sell' ? 'current_user' : order.merchantId,
                    buyerName: order.type === 'sell' ? 'You' : order.merchantName,
                    sellerId: order.type === 'sell' ? order.merchantId : 'current_user',
                    sellerName: order.type === 'sell' ? order.merchantName : 'You',
                    amount,
                    cryptoAmount: amount / order.price,
                    totalPrice: amount,
                    paymentMethod,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
                };
                resolve(trade);
            }, 800);
        });
    }

    /**
     * Get trade details
     */
    async getTrade(tradeId: string): Promise<P2PTrade> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const order = MOCK_ORDERS[0];
                const trade: P2PTrade = {
                    id: tradeId,
                    orderId: order.id,
                    order,
                    buyerId: 'current_user',
                    buyerName: 'You',
                    sellerId: order.merchantId,
                    sellerName: order.merchantName,
                    amount: 1000000,
                    cryptoAmount: 1000000 / order.price,
                    totalPrice: 1000000,
                    paymentMethod: order.paymentMethods[0],
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
                };
                resolve(trade);
            }, 500);
        });
    }

    /**
     * Mark payment as sent
     */
    async confirmPayment(tradeId: string, proofUrl: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Payment confirmed for trade ${tradeId} with proof: ${proofUrl}`);
                resolve();
            }, 1000);
        });
    }

    /**
     * Release crypto (seller action)
     */
    async releaseCrypto(tradeId: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Crypto released for trade ${tradeId}`);
                resolve();
            }, 1000);
        });
    }

    /**
     * Cancel trade
     */
    async cancelTrade(tradeId: string, reason: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Trade ${tradeId} cancelled: ${reason}`);
                resolve();
            }, 800);
        });
    }

    /**
     * Get user's orders
     */
    async getUserOrders(): Promise<P2POrder[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_ORDERS.slice(0, 2));
            }, 500);
        });
    }

    /**
     * Get user's P2P stats
     */
    async getUserStats(): Promise<UserP2PStats> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    totalTrades: 150,
                    completedTrades: 148,
                    completionRate: 98.7,
                    avgReleaseTime: 8,
                    rating: 4.9,
                    positiveReviews: 145,
                    negativeReviews: 3
                });
            }, 500);
        });
    }

    /**
     * Get trade messages
     */
    async getTradeMessages(tradeId: string): Promise<TradeMessage[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 'msg_1',
                        tradeId,
                        senderId: 'system',
                        senderName: 'System',
                        message: 'Giao dịch đã được tạo. Vui lòng thanh toán trong vòng 15 phút.',
                        timestamp: new Date().toISOString(),
                        isSystem: true
                    }
                ]);
            }, 300);
        });
    }

    /**
     * Send trade message
     */
    async sendTradeMessage(tradeId: string, message: string): Promise<TradeMessage> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: `msg_${Date.now()}`,
                    tradeId,
                    senderId: 'current_user',
                    senderName: 'You',
                    message,
                    timestamp: new Date().toISOString()
                });
            }, 300);
        });
    }

    /**
     * Get available payment methods
     */
    getPaymentMethods(): PaymentMethod[] {
        return PAYMENT_METHODS;
    }
}

export default new P2PService();
