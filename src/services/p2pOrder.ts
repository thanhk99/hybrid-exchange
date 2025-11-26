import {
    P2POrder,
    P2PFilters,
    PaymentMethod,
    OrderType,
    UserP2PStats
} from '@/src/types/p2p';
import axiosInstance from '@/src/libs/axios';

// Mock payment methods for mapping
const PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: 'bank_1',
        uid: 'user123',
        type: 'bank_transfer',
        name: 'Chuyển khoản ngân hàng',
        accountName: 'Nguyen Van A',
        accountNumber: '1234567890',
        bankName: 'Vietcombank',
        isDefault: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'momo_1',
        uid: 'user123',
        type: 'momo',
        name: 'Momo',
        accountName: 'Nguyen Van A',
        accountNumber: '0901234567',
        isDefault: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'zalopay_1',
        uid: 'user123',
        type: 'zalopay',
        name: 'ZaloPay',
        accountName: 'Nguyen Van A',
        accountNumber: '0901234567',
        isDefault: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'viettel_1',
        uid: 'user123',
        type: 'viettel_pay',
        name: 'ViettelPay',
        accountName: 'Nguyen Van A',
        accountNumber: '0901234567',
        isDefault: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Mock orders for fallback
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
    }
];

class P2POrderService {
    /**
     * Get P2P orders with filters
     */
    async getOrders(filters: P2PFilters): Promise<P2POrder[]> {
        try {
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
                    const typeMap: Record<string, string> = {
                        'BankTransfer': 'bank_transfer',
                        'Momo': 'momo',
                        'ZaloPay': 'zalopay',
                        'ViettelPay': 'viettel_pay'
                    };
                    const type = typeMap[pm] || pm.toLowerCase();
                    return PAYMENT_METHODS.find(m => m.type === type) || {
                        id: `${type}_${item.id}`,
                        uid: 'unknown',
                        type: type as any,
                        name: pm,
                        isDefault: false,
                        isActive: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
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
            return [];
        }
    }

    /**
     * Create a new P2P order
     */
    async createOrder(orderData: Partial<P2POrder>): Promise<P2POrder> {
        try {
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
            throw new Error(error.response?.data?.message || 'Failed to create order');
        }
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
}

export default new P2POrderService();
