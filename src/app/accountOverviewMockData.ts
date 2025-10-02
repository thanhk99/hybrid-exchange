// Status enums for user verification and account states
export enum VerificationStatus {
  VERIFIED = 'verified',
  PENDING = 'pending',
  UNVERIFIED = 'unverified'
}

export enum UserTier {
  REGULAR = 'regular',
  VIP = 'vip',
  PRO = 'pro'
}

export enum ChartPeriod {
  ONE_DAY = '1d',
  ONE_WEEK = '1w', 
  ONE_MONTH = '1m',
  SIX_MONTHS = '6m'
}

export enum PriceTableTab {
  FAVORITES = 'favorites',
  TOP = 'top',
  POPULAR = 'popular',
  GAINERS = 'gainers',
  NEW = 'new'
}

// Data passed as props to the root component
export const mockRootProps = {
  user: {
    email: "nhu@gmail.com" as const,
    userId: "547236594731021903" as const,
    avatar: "https://i.pravatar.cc/150?img=1" as const,
    verificationStatus: VerificationStatus.VERIFIED,
    country: "Việt Nam" as const,
    tier: UserTier.REGULAR,
    isGoogleLinked: true as const
  },
  balance: {
    totalValue: 32860.50, // Show actual balance instead of 0
    currency: "USD",
    pnlToday: 125.50,
    pnlPercentage: 2.45,
    chartData: [
      { time: "21:10", value: 32750.00 },
      { time: "02:00", value: 32800.00 },
      { time: "06:50", value: 32820.00 },
      { time: "11:30", value: 32840.00 },
      { time: "16:20", value: 32860.50 }
    ]
  },
  notifications: [
    {
      date: "28/08/2025",
      title: "OKX niêm yết futures vĩnh cửu pre-market cho crypto XPL (Plasma)"
    },
    {
      date: "25/08/2025", 
      title: "OKX hủy niêm yết hợp đồng futures vĩnh cửu của token JST"
    },
    {
      date: "23/08/2025",
      title: "OKX niêm yết hợp đồng futures vĩnh cửu pre-market cho token WLFI (World Liberty Financial)"
    },
    {
      date: "21/08/2025",
      title: "OKX hủy niêm yết một số cặp giao dịch kỳ quỹ"
    }
  ],
  priceTableData: {
    activeTab: PriceTableTab.TOP,
    tokens: [
      {
        name: "BTC",
        fullName: "Bitcoin",
        price: 67420.50,
        change: 2.45,
        changePercent: 3.77
      },
      {
        name: "ETH",
        fullName: "Ethereum", 
        price: 3240.80,
        change: -45.20,
        changePercent: -1.38
      }
    ]
  }
};

// Alternative mock data with balance for testing both states
export const mockRootPropsWithBalance = {
  ...mockRootProps,
  balance: {
    totalValue: 32860.00,
    currency: "USD",
    pnlToday: 125.50,
    pnlPercentage: 2.45,
    chartData: [
      { time: "21:10", value: 32750.00 },
      { time: "02:00", value: 32800.00 },
      { time: "06:50", value: 32820.00 },
      { time: "11:30", value: 32840.00 },
      { time: "16:20", value: 32860.00 }
    ]
  }
};