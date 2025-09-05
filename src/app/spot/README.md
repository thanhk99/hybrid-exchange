# Trang Chi Tiết Coin - Spot Trading

## Tổng quan

Hệ thống này cung cấp trang hiển thị chi tiết dữ liệu coin dựa trên WebSocket từ backend Spring Boot. Người dùng có thể chọn coin từ trang spot chính và xem thông tin chi tiết bao gồm biểu đồ giá, thông tin giao dịch và các chỉ số quan trọng.

## Cấu trúc File

```
src/app/spot/
├── page.tsx                    # Trang chính hiển thị danh sách coin
├── [symbol]/
│   ├── page.tsx               # Trang chi tiết coin động
│   └── components/
│       ├── CoinDetailHeader.tsx  # Header hiển thị thông tin cơ bản
│       ├── PriceChart.tsx         # Biểu đồ giá kline
│       ├── PriceInfo.tsx          # Thông tin giá và thống kê
│       └── TradingInfo.tsx        # Form giao dịch
```

## Tính năng chính

### 1. Trang Spot Chính (`/spot`)
- Hiển thị danh sách tất cả coin với giá thời gian thực
- Kết nối WebSocket để nhận dữ liệu từ `/topic/spot-prices`
- Click vào coin để điều hướng đến trang chi tiết
- Hiển thị trạng thái kết nối WebSocket

### 2. Trang Chi Tiết Coin (`/spot/[symbol]`)
- Route động cho từng coin (ví dụ: `/spot/btc`, `/spot/eth`)
- Kết nối WebSocket để nhận dữ liệu kline từ `/topic/kline-data`
- Hiển thị thông tin chi tiết về coin được chọn

### 3. Components

#### CoinDetailHeader
- Hiển thị tên coin, giá hiện tại, phần trăm thay đổi
- Avatar coin với gradient màu
- Thông tin volume

#### PriceChart
- Biểu đồ candlestick hiển thị dữ liệu kline
- Vẽ bằng HTML5 Canvas
- Hiển thị giá cao nhất, thấp nhất, mở, đóng
- Màu sắc phân biệt tăng/giảm giá

#### PriceInfo
- Thông tin giá chi tiết
- Thống kê 24h (cao nhất, thấp nhất)
- Tính toán xu hướng giá
- Hiển thị thời gian cập nhật cuối

#### TradingInfo
- Form đặt lệnh mua/bán
- Tính toán tổng tiền tự động
- Các thao tác nhanh (giá thị trường, +/-1%)
- Validation input

## WebSocket Integration

### Backend Integration
Hệ thống tích hợp với backend Spring Boot qua WebSocket:

```java
// Backend WebSocket class
public class SpotPriceCoinSocket extends WebSocketClient {
    // Subscribe đến các coin: BTC, ETH, SOL
    // Gửi dữ liệu kline đến topic: /topic/kline-data
}
```

### Frontend WebSocket
- Sử dụng STOMP over SockJS
- Kết nối đến `/ws` endpoint
- Subscribe đến các topic:
  - `/topic/spot-prices` - Dữ liệu giá tổng quan
  - `/topic/kline-data` - Dữ liệu kline chi tiết

## Cách sử dụng

1. **Truy cập trang spot**: `/spot`
2. **Chọn coin**: Click vào bất kỳ coin nào trong bảng
3. **Xem chi tiết**: Trang sẽ chuyển đến `/spot/[symbol]`
4. **Theo dõi giá**: Dữ liệu được cập nhật theo thời gian thực
5. **Giao dịch**: Sử dụng form giao dịch để đặt lệnh

## Dữ liệu WebSocket

### Spot Prices Topic (`/topic/spot-prices`)
```typescript
interface CryptoData {
  symbol: string;
  price: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  timestamp: number;
}
```

### Kline Data Topic (`/topic/kline-data`)
```typescript
interface KlineData {
  symbol: string;
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  startTime: number;
  closeTime: number;
  interval: string;
  isClosed: boolean;
}
```

## Responsive Design

- Thiết kế responsive với Tailwind CSS
- Layout grid linh hoạt cho desktop/mobile
- Biểu đồ tự động điều chỉnh kích thước
- Form giao dịch tối ưu cho mobile

## Error Handling

- Xử lý lỗi kết nối WebSocket
- Hiển thị trạng thái loading
- Fallback khi không có dữ liệu
- Validation form giao dịch

## Performance

- Giới hạn số điểm dữ liệu hiển thị (100 điểm gần nhất)
- Canvas rendering hiệu quả
- Debounce cho các thao tác người dùng
- Memory management cho WebSocket subscriptions
