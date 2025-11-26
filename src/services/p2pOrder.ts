import {
    P2POrder,
    P2PFilters,
    PaymentMethod,
    OrderType,
    UserP2PStats
} from '@/src/types/p2p';
import axiosInstance from '@/src/libs/axios';

// Helper function to get payment method by type
const getPaymentMethodByType = (type: string): PaymentMethod => {
    const typeMap: Record<string, string> = {
        'BANK_TRANSFER': 'BANK_TRANSFER',
        'BankTransfer': 'BANK_TRANSFER',
        'Momo': 'MOMO',
        'MOMO': 'MOMO',
        'ZaloPay': 'ZALOPAY',
        'ZALOPAY': 'ZALOPAY',
        'ViettelPay': 'VIETTEL_PAY',
        'VIETTEL_PAY': 'VIETTEL_PAY',
        'VNPay': 'VNPAY',
        'VNPAY': 'VNPAY',
        'ShopeePay': 'SHOPEEPAY',
        'SHOPEEPAY': 'SHOPEEPAY'
    };

    const mappedType = typeMap[type] || type.toUpperCase();

    return {
        id: `${mappedType}_temp`,
        uid: 'user',
        type: mappedType as any,
        name: type,
        isDefault: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
};

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
                paymentMethods: (item.paymentMethods || []).map((pm: any) => {
                    let rawType = '';
                    if (typeof pm === 'string') {
                        rawType = pm;
                    } else if (pm && typeof pm === 'object') {
                        rawType = pm.type || pm.code || '';
                    }
                    return getPaymentMethodByType(rawType);
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
    async createOrder(orderData: any): Promise<P2POrder> {
        try {
            const tradeType = orderData.type?.toUpperCase();

            const requestBody: any = {
                tradeType: tradeType,
                asset: orderData.currency,
                fiatCurrency: orderData.fiatCurrency,
                price: orderData.price,
                priceType: 'FIXED',
                minAmount: orderData.minLimit,
                maxAmount: orderData.maxLimit,
                availableAmount: orderData.availableAmount,
                termsConditions: orderData.terms,
                isActive: true
            };

            if (tradeType === 'SELL') {
                requestBody.paymentMethodId = orderData.paymentMethodId;
            } else {
                // For BUY orders, paymentMethods is an array of strings (types)
                // Backend expects UPPERCASE format which is now provided by the frontend
                requestBody.paymentMethods = orderData.paymentMethods;
            }

            console.log('Creating P2P order with data:', requestBody);

            const response = await axiosInstance.post('/api/v1/p2pads/create', requestBody);

            console.log('Response data:', response.data);

            const data = response.data;

            // Construct return object (mocking missing fields if necessary)
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
                paymentMethods: [], // This will be populated by getOrders usually
                terms: data.termsConditions || orderData.terms,
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
     * Get user's orders (ads)
     */
    async getUserOrders(): Promise<P2POrder[]> {
        try {
            const response = await axiosInstance.get('/api/v1/p2pads/myads');

            console.log('My ads response:', response.data);

            const apiData = response.data.data || response.data;

            if (!Array.isArray(apiData)) {
                console.error('API response is not an array:', apiData);
                return [];
            }

            // Map API response to frontend format
            const orders: P2POrder[] = apiData.map((item: any) => ({
                id: item.id?.toString() || `order_${Date.now()}`,
                type: item.tradeType?.toLowerCase() as OrderType,
                merchantId: item.userId || 'unknown',
                merchantName: 'You', // This is user's own ad
                merchantRating: 0, // Not applicable for own ads
                merchantCompletedTrades: 0,
                merchantCompletionRate: 0,
                currency: item.asset,
                fiatCurrency: item.fiatCurrency,
                price: item.price,
                minLimit: item.minAmount,
                maxLimit: item.maxAmount,
                availableAmount: item.availableAmount,
                paymentMethods: (item.paymentMethods || []).map((pm: any) => {
                    const typeMap: Record<string, string> = {
                        'BANK_TRANSFER': 'BANK_TRANSFER',
                        'BankTransfer': 'BANK_TRANSFER',
                        'Momo': 'MOMO',
                        'MOMO': 'MOMO',
                        'ZaloPay': 'ZALOPAY',
                        'ZALOPAY': 'ZALOPAY',
                        'ViettelPay': 'VIETTEL_PAY',
                        'VIETTEL_PAY': 'VIETTEL_PAY',
                        'VNPay': 'VNPAY',
                        'VNPAY': 'VNPAY',
                        'ShopeePay': 'SHOPEEPAY',
                        'SHOPEEPAY': 'SHOPEEPAY'
                    };

                    // Handle both string and object formats
                    let rawType = '';
                    if (typeof pm === 'string') {
                        rawType = pm;
                    } else if (pm && typeof pm === 'object') {
                        rawType = pm.type || pm.code || '';
                    }

                    const type = typeMap[rawType] || (rawType ? rawType.toUpperCase() : 'BANK_TRANSFER');

                    return {
                        id: item.paymentMethodId?.toString() || `${type}_${item.id}`,
                        uid: item.userId || 'unknown',
                        type: type as any,
                        name: rawType || 'Unknown Method',
                        isDefault: false,
                        isActive: true,
                        createdAt: item.createdAt || new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                }),
                terms: item.termsConditions || '',
                status: item.isActive ? 'active' : 'cancelled',
                createdAt: item.createdAt || new Date().toISOString()
            }));

            return orders;
        } catch (error: any) {
            console.error('Error fetching user ads:', error);
            return [];
        }
    }

    /**
     * Get user's P2P profile
     */
    async getUserProfile(): Promise<UserP2PStats> {
        try {
            const response = await axiosInstance.get('/api/v1/p2pads/user/profile');

            console.log('User profile response:', response.data);

            const data = response.data.data || response.data;

            // Map API response to UserP2PStats
            return {
                totalTrades: data.totalTransactions || 0,
                completedTrades: data.completedTransactions || 0,
                completionRate: parseFloat(data.completionRate) || 0,
                avgReleaseTime: 0, // Not provided by API
                rating: data.rating || 0,
                positiveReviews: 0, // Not provided by API
                negativeReviews: 0  // Not provided by API
            };
        } catch (error: any) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    }

    /**
     * Get user's P2P stats (alias for getUserProfile for backward compatibility)
     */
    async getUserStats(): Promise<UserP2PStats> {
        return this.getUserProfile();
    }

    /**
     * Get user's transaction history
     */
    async getUserHistory(): Promise<any[]> {
        try {
            const response = await axiosInstance.get('/api/v1/p2pads/user/history');

            console.log('User history response:', response.data);

            const apiData = response.data.data || response.data;

            if (!Array.isArray(apiData)) {
                console.error('API response is not an array:', apiData);
                return [];
            }

            // Map API response to transaction history format
            return apiData.map((item: any) => ({
                id: item.id?.toString() || `trade_${Date.now()}`,
                adId: item.adId,
                type: item.type, // BUY or SELL
                asset: item.asset,
                fiatCurrency: item.fiatCurrency,
                cryptoAmount: item.cryptoAmount,
                fiatAmount: item.fiatAmount,
                status: item.status?.toLowerCase() || 'pending',
                paymentMethod: getPaymentMethodByType(item.paymentMethod || 'BANK_TRANSFER'),
                counterparty: item.counterparty || 'Unknown',
                createdAt: item.createdAt || new Date().toISOString(),
                completedAt: item.completedAt || null
            }));
        } catch (error: any) {
            console.error('Error fetching user history:', error);
            return [];
        }
    }
}

export default new P2POrderService();
