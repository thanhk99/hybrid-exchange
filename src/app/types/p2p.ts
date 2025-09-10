// P2P related enums
export enum OrderType {
  BUY = 'buy',
  SELL = 'sell'
}

export enum TradeStatus {
  PENDING = 'pending',
  PAID = 'paid', 
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed'
}

export enum OrderStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed'
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  SYSTEM = 'system'
}

export enum SortBy {
  PRICE = 'price',
  COMPLETION_RATE = 'completion_rate',
  TRADES_COUNT = 'trades_count'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export interface P2POrder {
  id: string;
  userId: string;
  username: string;
  userRating: number;
  completedTrades: number;
  type: 'buy' | 'sell';
  cryptocurrency: string;
  fiatCurrency: string;
  price: number;
  minAmount: number;
  maxAmount: number;
  availableAmount: number;
  paymentMethods: PaymentMethod[];
  terms: string;
  createdAt: Date;
  status: 'active' | 'inactive' | 'completed';
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  processingTime: string;
}

export interface P2PTrade {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  price: number;
  totalFiat: number;
  cryptocurrency: string;
  fiatCurrency: string;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'paid' | 'confirmed' | 'completed' | 'cancelled' | 'disputed';
  createdAt: Date;
  updatedAt: Date;
  messages: TradeMessage[];
}

export interface TradeMessage {
  id: string;
  userId: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'system';
}

export interface P2PFilters {
  cryptocurrency: string;
  fiatCurrency: string;
  paymentMethods: string[];
  minAmount?: number;
  maxAmount?: number;
  onlineOnly: boolean;
  sortBy: 'price' | 'completion_rate' | 'trades_count';
  sortOrder: 'asc' | 'desc';
}

// Props types
export interface P2PPageProps {
  initialFilters: P2PFilters;
}

export interface P2PMarketProps {
  orders: P2POrder[];
  loading: boolean;
  tradeType: 'buy' | 'sell';
}

export interface OrderCardProps {
  order: P2POrder;
  tradeType: 'buy' | 'sell';
  onTradeClick: (order: P2POrder) => void;
}

// Store types
export interface P2PState {
  orders: P2POrder[];
  myOrders: P2POrder[];
  activeTrades: P2PTrade[];
  tradeHistory: P2PTrade[];
  filters: P2PFilters;
  loading: boolean;
  error: string | null;
  selectedOrder: P2POrder | null;
  currentTrade: P2PTrade | null;
}

// Query types
export interface P2POrdersResponse {
  data: P2POrder[];
  total: number;
  page: number;
  limit: number;
}

export interface P2PTradeResponse {
  data: P2PTrade;
  message: string;
}