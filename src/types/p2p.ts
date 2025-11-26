export type OrderType = 'buy' | 'sell';
export type OrderStatus = 'active' | 'completed' | 'cancelled';
export type TradeStatus = 'pending' | 'paid' | 'confirmed' | 'completed' | 'cancelled' | 'disputed'
    | 'ORDER_PLACED' | 'AWAITING_PAYMENT' | 'PAYMENT_SENT' | 'AWAITING_RELEASE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTE_OPENED'
    | 'order_placed' | 'awaiting_payment' | 'payment_sent' | 'awaiting_release' | 'dispute_opened';
export type PaymentMethodType = 'BANK_TRANSFER' | 'MOMO' | 'ZALOPAY' | 'VIETTEL_PAY' | 'VNPAY' | 'SHOPEEPAY';

export interface PaymentMethod {
    id: string;
    uid?: string;
    type: PaymentMethodType;
    name?: string;
    icon?: string;
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    branch?: string;
    qrCode?: string;
    isDefault?: boolean;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}

export interface P2POrder {
    id: string;
    type: OrderType;
    merchantId: string;
    merchantName: string;
    merchantRating: number;
    merchantCompletedTrades: number;
    merchantCompletionRate: number;
    currency: string;
    fiatCurrency: string;
    price: number;
    minLimit: number;
    maxLimit: number;
    availableAmount: number;
    paymentMethods: PaymentMethod[];
    terms?: string;
    status: OrderStatus;
    createdAt: string;
}

export interface P2PTrade {
    id: string;
    orderId: string;
    order: P2POrder;
    buyerId: string;
    buyerName: string;
    sellerId: string;
    sellerName: string;
    amount: number;
    cryptoAmount: number;
    totalPrice: number;
    paymentMethod: PaymentMethod;
    status: TradeStatus;
    paymentProof?: string;
    createdAt: string;
    expiresAt: string;
    completedAt?: string;
}

export interface TradeMessage {
    id: string;
    tradeId: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: string;
    isSystem?: boolean;
}

export interface UserP2PStats {
    totalTrades: number;
    completedTrades: number;
    completionRate: number;
    avgReleaseTime: number; // in minutes
    rating: number;
    positiveReviews: number;
    negativeReviews: number;
}

export interface P2PFilters {
    type: OrderType;
    currency?: string;
    fiatCurrency?: string;
    paymentMethods?: PaymentMethodType[];
    minAmount?: number;
    maxAmount?: number;
}
