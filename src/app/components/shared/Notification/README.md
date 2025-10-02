# Hệ thống Thông báo (Notification System)

## Tổng quan

Hệ thống thông báo tùy chỉnh với 4 loại thông báo: **Thông tin**, **Cảnh báo**, **Lỗi**, và **Thành công**. Hệ thống được tích hợp vào các form đăng nhập và đăng ký.

## Các tính năng

### 🎨 4 Loại thông báo
- **Thông tin** (Info): Màu xanh dương (#1890ff)
- **Thành công** (Success): Màu xanh lá (#52c41a)  
- **Cảnh báo** (Warning): Màu vàng (#faad14)
- **Lỗi** (Error): Màu đỏ (#ff4d4f)

### ✨ Tính năng nâng cao
- **Animation**: Hiệu ứng slide-in từ bên phải
- **Auto-dismiss**: Tự động ẩn sau 5 giây (có thể tùy chỉnh)
- **Progress bar**: Thanh tiến trình hiển thị thời gian còn lại
- **Manual close**: Có thể đóng thủ công bằng nút X
- **Responsive**: Tương thích với mobile
- **Dark mode**: Hỗ trợ chế độ tối
- **Multiple notifications**: Có thể hiển thị nhiều thông báo cùng lúc

## Cách sử dụng

### 1. Import hook useNotification

```tsx
import { useNotification } from '@/app/components/shared/Notification';
```

### 2. Sử dụng trong component

```tsx
function MyComponent() {
  const { showInfo, showSuccess, showWarning, showError } = useNotification();

  const handleClick = () => {
    showSuccess("Thành công", "Thao tác đã được thực hiện thành công!");
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

### 3. Các phương thức có sẵn

```tsx
// Thông báo thông tin
showInfo("Tiêu đề", "Nội dung thông báo", 5000); // duration tùy chọn

// Thông báo thành công  
showSuccess("Tiêu đề", "Nội dung thông báo", 5000);

// Thông báo cảnh báo
showWarning("Tiêu đề", "Nội dung thông báo", 5000);

// Thông báo lỗi
showError("Tiêu đề", "Nội dung thông báo", 5000);
```

## Tích hợp vào các form

### Form đăng nhập
- ✅ Thông báo "Đang xử lý đăng nhập..." khi bắt đầu
- ✅ Thông báo thành công khi đăng nhập thành công
- ✅ Thông báo lỗi khi đăng nhập thất bại
- ✅ Thông báo khi sao chép email thành công/thất bại

### Form đăng ký  
- ✅ Thông báo cảnh báo khi thiếu thông tin bắt buộc
- ✅ Thông báo cảnh báo khi mật khẩu quá ngắn
- ✅ Thông báo "Đang xử lý đăng ký..." khi bắt đầu
- ✅ Thông báo thành công khi đăng ký thành công
- ✅ Thông báo lỗi khi đăng ký thất bại
- ✅ Thông báo khi sao chép thông tin thành công/thất bại

## Cấu trúc file

```
src/app/components/shared/Notification/
├── Notification.tsx          # Component thông báo chính
├── Notification.css          # Styles cho thông báo
├── NotificationContext.tsx   # Context và Provider
├── NotificationDemo.tsx      # Component demo
└── index.ts                  # Export các module
```

## Demo

Truy cập `/notification-test` để xem demo hệ thống thông báo.

## Customization

### Thay đổi thời gian hiển thị mặc định

```tsx
// Trong NotificationContext.tsx
const showNotification = useCallback((
  type: NotificationType, 
  title: string, 
  message: string, 
  duration: number = 5000 // Thay đổi giá trị này
) => {
  // ...
}, [removeNotification]);
```

### Thay đổi vị trí hiển thị

```css
/* Trong Notification.css */
.notification-container {
  position: fixed;
  top: 20px;        /* Thay đổi vị trí top */
  right: 20px;      /* Thay đổi vị trí right */
  /* ... */
}
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)  
- ✅ Safari (latest)
- ✅ Mobile browsers

## Dependencies

- React 18+
- Ant Design Icons
- CSS3 (animations, backdrop-filter)
