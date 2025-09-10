// Mock data for P2P trading interface

export const mockStore = {
  p2p: {
    orders: [],
    myOrders: [],
    activeTrades: [],
    tradeHistory: [],
    filters: {
      cryptocurrency: 'USDT' as const,
      fiatCurrency: 'VND' as const,
      paymentMethods: [],
      onlineOnly: false,
      sortBy: 'price' as const,
      sortOrder: 'asc' as const
    },
    loading: false,
    error: null,
    selectedOrder: null,
    currentTrade: null
  }
};

export const mockQuery = {
  p2pOrders: [
    {
      id: 'order-1',
      userId: 'user-1',
      username: 'CryptoTrader123',
      userRating: 4.8,
      completedTrades: 156,
      type: 'sell' as const,
      cryptocurrency: 'USDT',
      fiatCurrency: 'VND',
      price: 25100,
      minAmount: 100,
      maxAmount: 5000,
      availableAmount: 10000,
      paymentMethods: [
        { id: 'bank-1', name: 'Ngân hàng', icon: 'bank', processingTime: '5-15 phút' },
        { id: 'momo-1', name: 'MoMo', icon: 'momo', processingTime: '1-5 phút' }
      ],
      terms: 'Chuyển khoản nhanh, có xác nhận SMS',
      createdAt: new Date('2024-01-15T10:30:00Z'),
      status: 'active' as const
    },
    {
      id: 'order-2', 
      userId: 'user-2',
      username: 'VietnamBTC',
      userRating: 4.9,
      completedTrades: 89,
      type: 'buy' as const,
      cryptocurrency: 'USDT',
      fiatCurrency: 'VND', 
      price: 25050,
      minAmount: 200,
      maxAmount: 3000,
      availableAmount: 8000,
      paymentMethods: [
        { id: 'bank-2', name: 'Vietcombank', icon: 'bank', processingTime: '10-20 phút' }
      ],
      terms: 'Chỉ giao dịch trong giờ hành chính',
      createdAt: new Date('2024-01-15T09:15:00Z'),
      status: 'active' as const
    },
    {
      id: 'order-2', 
      userId: 'user-2',
      username: 'VietnamBTC',
      userRating: 4.9,
      completedTrades: 89,
      type: 'buy' as const,
      cryptocurrency: 'USDT',
      fiatCurrency: 'VND', 
      price: 25050,
      minAmount: 200,
      maxAmount: 3000,
      availableAmount: 8000,
      paymentMethods: [
        { id: 'bank-2', name: 'Vietcombank', icon: 'bank', processingTime: '10-20 phút' }
      ],
      terms: 'Chỉ giao dịch trong giờ hành chính',
      createdAt: new Date('2024-01-15T09:15:00Z'),
      status: 'active' as const
    }
  ],
  paymentMethods: [
    { id: 'bank', name: 'Ngân hàng', icon: 'bank', processingTime: '5-30 phút' },
    { id: 'momo', name: 'MoMo', icon: 'momo', processingTime: '1-5 phút' },
    { id: 'zalopay', name: 'ZaloPay', icon: 'zalopay', processingTime: '1-5 phút' },
    { id: 'viettelpay', name: 'ViettelPay', icon: 'viettelpay', processingTime: '1-5 phút' }
  ]
};

export const mockRootProps = {
  initialFilters: {
    cryptocurrency: 'USDT' as const,
    fiatCurrency: 'VND' as const,
    paymentMethods: [],
    onlineOnly: false,
    sortBy: 'price' as const,
    sortOrder: 'asc' as const
  }
};