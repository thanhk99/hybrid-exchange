# Luồng hoạt động hệ thống Spot Trading

## Diagram luồng dữ liệu

```mermaid
graph TD
    A[Backend Spring Boot] -->|WebSocket| B[Frontend Next.js]
    B --> C[Trang Spot /spot]
    C --> D[Danh sách Coin]
    D -->|Click| E[Trang Chi Tiết /spot/symbol]
    
    A -->|/topic/spot-prices| F[useWebSocket Hook]
    F --> G[CryptoData Interface]
    G --> D
    
    A -->|/topic/kline-data| H[useWebSocket Hook]
    H --> I[KlineData Interface]
    I --> E
    
    E --> J[CoinDetailHeader]
    E --> K[PriceChart]
    E --> L[PriceInfo]
    E --> M[TradingInfo]
    
    K --> N[Canvas Rendering]
    L --> O[Price Statistics]
    M --> P[Trading Form]
```

## Luồng người dùng

```mermaid
sequenceDiagram
    participant U as User
    participant S as Spot Page
    participant D as Detail Page
    participant W as WebSocket
    participant B as Backend
    
    U->>S: Truy cập /spot
    S->>W: Kết nối WebSocket
    W->>B: Subscribe /topic/spot-prices
    B->>W: Gửi dữ liệu giá coin
    W->>S: Cập nhật danh sách coin
    S->>U: Hiển thị danh sách
    
    U->>S: Click vào coin
    S->>D: Chuyển đến /spot/symbol
    D->>W: Subscribe /topic/kline-data
    W->>B: Subscribe kline data
    B->>W: Gửi dữ liệu kline
    W->>D: Cập nhật biểu đồ và thông tin
    D->>U: Hiển thị trang chi tiết
    
    loop Real-time Updates
        B->>W: Dữ liệu mới
        W->>D: Cập nhật UI
        D->>U: Hiển thị thay đổi
    end
```

## Cấu trúc Component

```mermaid
graph LR
    A[Spot Page] --> B[Coin List Table]
    B --> C[Coin Row Click]
    C --> D[Detail Page]
    
    D --> E[CoinDetailHeader]
    D --> F[PriceChart]
    D --> G[PriceInfo]
    D --> H[TradingInfo]
    
    E --> I[Symbol & Price]
    E --> J[Change %]
    E --> K[Volume]
    
    F --> L[Canvas Chart]
    F --> M[Candlestick Data]
    
    G --> N[24h Stats]
    G --> O[Price Trend]
    
    H --> P[Buy/Sell Form]
    H --> Q[Quick Actions]
```

## WebSocket Topics

```mermaid
graph TD
    A[Backend SpotPriceCoinSocket] --> B[/topic/spot-prices]
    A --> C[/topic/kline-data]
    
    B --> D[Frontend Spot Page]
    C --> E[Frontend Detail Page]
    
    D --> F[CryptoData Interface]
    E --> G[KlineData Interface]
    
    F --> H[Price List Display]
    G --> I[Chart Rendering]
    G --> J[Price Statistics]
```

## Data Flow

```mermaid
flowchart LR
    A[Binance WebSocket] --> B[Spring Boot Backend]
    B --> C[SpotPriceCoinSocket]
    C --> D[STOMP Messaging]
    D --> E[Frontend WebSocket]
    E --> F[useWebSocket Hook]
    F --> G[React Components]
    G --> H[UI Updates]
```

## Error Handling Flow

```mermaid
graph TD
    A[WebSocket Connection] --> B{Connection Status}
    B -->|Success| C[Subscribe Topics]
    B -->|Error| D[Show Error Message]
    B -->|Disconnected| E[Show Loading State]
    
    C --> F[Receive Data]
    F --> G{Data Valid?}
    G -->|Yes| H[Update UI]
    G -->|No| I[Log Error]
    
    D --> J[Retry Connection]
    E --> K[Reconnect Attempt]
    I --> L[Fallback UI]
```

## Component Props & State

```mermaid
graph TD
    A[CoinDetailPage] --> B[useParams: symbol]
    A --> C[useWebSocket: kline-data]
    A --> D[useState: klineData]
    A --> E[useState: currentPrice]
    
    F[CoinDetailHeader] --> G[symbol, price, changePercent, volume]
    H[PriceChart] --> I[data, symbol, timeframe]
    J[PriceInfo] --> K[data, klineData]
    L[TradingInfo] --> M[symbol, currentPrice]
```

## Performance Optimizations

```mermaid
graph TD
    A[Data Management] --> B[Limit to 100 data points]
    A --> C[Canvas rendering]
    A --> D[Debounced updates]
    
    E[Memory Management] --> F[Cleanup subscriptions]
    E --> G[Remove event listeners]
    E --> H[Clear intervals]
    
    I[UI Optimization] --> J[useCallback hooks]
    I --> K[useMemo for calculations]
    I --> L[Conditional rendering]
```
