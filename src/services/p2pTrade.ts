import {
    P2POrder,
    P2PTrade,
    TradeMessage,
    PaymentMethod,
    OrderType
} from '@/src/types/p2p';
import axiosInstance from '@/src/libs/axios';

// Mock payment methods for mapping
const PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: 'bank_1',
        uid: 'user123',
        type: 'BANK_TRANSFER',
        name: 'Chuyển khoản ngân hàng',
        accountName: 'Nguyen Van A',
        accountNumber: '1234567890',
        bankName: 'Vietcombank',
        isDefault: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

class P2PTradeService {
    /**
     * Create a trade from an order
     */
    async createTrade(adId: string, amount: number): Promise<P2PTrade> {
        try {
            const requestBody = {
                adId,
                amount
            };

            console.log('Creating trade with data:', requestBody);

            const response = await axiosInstance.post('/api/v1/p2pads/order', requestBody);
            console.log('Create trade response:', response.data);

            const data = response.data.data || response.data;

            // Get order data from response
            const orderData = data.order || data.ad || data.p2pAd || {};

            const order: P2POrder = {
                id: orderData.id || adId,
                type: (orderData.tradeType || orderData.type || 'buy').toLowerCase() as OrderType,
                merchantId: orderData.uid || 'unknown',
                merchantName: orderData.name || 'Unknown',
                merchantRating: orderData.percentLike || 0,
                merchantCompletedTrades: orderData.totalTransfer || 0,
                merchantCompletionRate: orderData.percentComplete || 0,
                currency: orderData.asset || 'USDT',
                fiatCurrency: orderData.fiatCurrency || 'VND',
                price: orderData.price || 0,
                minLimit: orderData.minAmount || 0,
                maxLimit: orderData.maxAmount || 0,
                availableAmount: orderData.availableAmount || 0,
                paymentMethods: (orderData.paymentMethods || []).map((pm: any) => {
                    const typeMap: Record<string, string> = {
                        'BankTransfer': 'BANK_TRANSFER',
                        'Momo': 'MOMO',
                        'ZaloPay': 'ZALOPAY',
                        'ViettelPay': 'VIETTEL_PAY',
                        'VNPay': 'VNPAY',
                        'ShopeePay': 'SHOPEEPAY'
                    };

                    // Handle both string and object formats safely
                    let rawType = '';
                    if (typeof pm === 'string') {
                        rawType = pm;
                    } else if (pm && typeof pm === 'object') {
                        rawType = pm.type || pm.code || '';
                    }

                    const type = typeMap[rawType] || (rawType ? rawType.toUpperCase() : 'UNKNOWN');

                    return PAYMENT_METHODS.find(m => m.type === type) || {
                        id: `${type}_${orderData.id || adId}`,
                        uid: 'unknown',
                        type: type as any,
                        name: rawType || 'Unknown Method',
                        isDefault: false,
                        isActive: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                }),
                terms: orderData.terms || '',
                status: 'active',
                createdAt: orderData.createdAt || new Date().toISOString()
            };

            const selectedPaymentMethod = order.paymentMethods.find(pm => pm.id === data.paymentMethodId) || order.paymentMethods[0];

            // Keep backend status as-is for proper UI condition matching
            const trade: P2PTrade = {
                id: data.id,
                orderId: adId,
                order,
                buyerId: data.buyerId,
                buyerName: data.buyerName || 'Unknown',
                sellerId: data.sellerId,
                sellerName: data.sellerName || 'Unknown',
                amount: data.amount,
                cryptoAmount: data.cryptoAmount,
                totalPrice: data.totalPrice,
                paymentMethod: selectedPaymentMethod || PAYMENT_METHODS[0], // Fallback to avoid undefined
                status: data.status as any, // Keep backend enum value
                createdAt: data.createdAt,
                expiresAt: data.expiresAt
            };

            return trade;
        } catch (error: any) {
            console.error('Error creating trade:', error);
            throw new Error(error.response?.data?.message || 'Failed to create trade');
        }
    }

    /**
     * Get trade details
     */
    async getTrade(tradeId: string): Promise<P2PTrade> {
        try {
            const response = await axiosInstance.get(`/api/v1/p2pads/order/${tradeId}`);
            console.log('Get trade response:', response.data);
            const data = response.data.data || response.data;

            const orderId = data.orderId || data.adId;
            const orderData = data.order || data.ad || data.p2pAd || {};

            const order: P2POrder = {
                id: orderData.id || orderId || 'unknown',
                type: (orderData.tradeType || orderData.type || data.orderType || 'buy').toLowerCase() as OrderType,
                merchantId: orderData.uid || orderData.merchantId || data.merchantId || 'unknown',
                merchantName: orderData.name || orderData.merchantName || data.merchantName || 'Unknown',
                merchantRating: orderData.percentLike || 0,
                merchantCompletedTrades: orderData.totalTransfer || 0,
                merchantCompletionRate: orderData.percentComplete || 0,
                currency: orderData.asset || data.asset || 'USDT',
                fiatCurrency: orderData.fiatCurrency || data.fiatCurrency || 'VND',
                price: orderData.price || data.price || 0,
                minLimit: orderData.minAmount || 0,
                maxLimit: orderData.maxAmount || 0,
                availableAmount: orderData.availableAmount || 0,
                paymentMethods: (orderData.paymentMethods || []).map((pm: any) => {
                    if (typeof pm === 'string') {
                        const typeMap: Record<string, string> = {
                            'BankTransfer': 'BANK_TRANSFER',
                            'Momo': 'MOMO',
                            'ZaloPay': 'ZALOPAY',
                            'ViettelPay': 'VIETTEL_PAY',
                            'VNPay': 'VNPAY',
                            'ShopeePay': 'SHOPEEPAY'
                        };
                        const type = typeMap[pm] || pm.toUpperCase();
                        return PAYMENT_METHODS.find(m => m.type === type) || {
                            id: `${type}_${Date.now()}`,
                            uid: 'unknown',
                            type: type as any,
                            name: pm,
                            isDefault: false,
                            isActive: true,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };
                    }
                    return pm;
                }),
                terms: orderData.terms || '',
                status: 'active',
                createdAt: orderData.createdAt || ''
            };

            // Keep backend status as-is for proper UI condition matching
            const trade: P2PTrade = {
                id: data.id,
                orderId: orderId,
                order: order,
                buyerId: data.buyerId,
                buyerName: data.buyerName,
                sellerId: data.sellerId,
                sellerName: data.sellerName,
                amount: data.amount,
                cryptoAmount: data.cryptoAmount,
                totalPrice: data.totalPrice,
                paymentMethod: data.paymentMethod ? {
                    id: data.paymentMethod.id || `pm_${Date.now()}`,
                    uid: data.paymentMethod.uid || 'unknown',
                    type: data.paymentMethod.type,
                    name: data.paymentMethod.bankName || data.paymentMethod.name || 'Bank Transfer',
                    accountName: data.paymentMethod.accountName,
                    accountNumber: data.paymentMethod.accountNumber,
                    bankName: data.paymentMethod.bankName,
                    branch: data.paymentMethod.branch,
                    isDefault: false,
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                } : (order.paymentMethods[0] || PAYMENT_METHODS[0]),
                status: data.status as any, // Keep backend enum value
                createdAt: data.createdAt,
                expiresAt: data.expiresAt
            };

            return trade;
        } catch (error: any) {
            console.error('Error fetching trade:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch trade');
        }
    }

    /**
     * Buyer confirms payment
     */
    async confirmPayment(orderId: string, proofUrl: string): Promise<void> {
        try {
            const response = await axiosInstance.post(`/api/v1/p2pads/order/${orderId}/confirm`);
            console.log('Confirm payment response:', response.data);
        } catch (error: any) {
            console.error('Error confirming payment:', error);
            throw new Error(error.response?.data?.message || 'Failed to confirm payment');
        }
    }

    /**
     * Seller releases crypto
     */
    async releaseCrypto(orderId: string): Promise<void> {
        try {
            const response = await axiosInstance.post(`/api/v1/p2pads/order/${orderId}/release`);
            console.log('Release crypto response:', response.data);
        } catch (error: any) {
            console.error('Error releasing crypto:', error);
            throw new Error(error.response?.data?.message || 'Failed to release crypto');
        }
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
}

export default new P2PTradeService();
