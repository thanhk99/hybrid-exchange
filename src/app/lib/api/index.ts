// API Services Export
export { default as AuthService } from './springboot-api/auth';
export { default as TokenService } from './springboot-api/token';
export { default as FundingService } from './springboot-api/funding';
export { default as AccountService } from './springboot-api/account';
export { default as BalanceService } from './springboot-api/balance';

// TODO: Add these services when needed
// export { default as NotificationService } from './springboot-api/notifications';
// export { default as MarketService } from './springboot-api/market';

// Types Export

export type {
  FundingTotalResponse,
  FundingChartData,
  FundingHistoryItem
} from './springboot-api/funding';

export type {
  UserProfile,
  AccountSecurity,
  AccountSettings
} from './springboot-api/account';

export type {
  BalanceData,
  BalanceApiResponse
} from './springboot-api/balance';

// TODO: Add these types when services are implemented

// export type {
//   NotificationItem,
//   NotificationResponse
// } from './springboot-api/notifications';

// export type {
//   TokenPrice,
//   MarketData,
//   PriceCategory
// } from './springboot-api/market';

// Axios instance
export { default as axiosInstance } from './axios';