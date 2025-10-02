# Authentication System

Hệ thống xác thực đã được tích hợp vào ứng dụng để bảo vệ các route yêu cầu đăng nhập.

## Các thành phần chính:

### 1. ProtectedRoute Component
- Tự động bảo vệ các route được định nghĩa trong `protectedRoutes`
- Chuyển hướng người dùng chưa đăng nhập đến `/login`
- Chuyển hướng người dùng đã đăng nhập khỏi trang login/register

### 2. useAuth Hook
- Cung cấp trạng thái xác thực hiện tại
- Phương thức logout tiện lợi
- Phương thức requireAuth để kiểm tra xác thực

### 3. withAuth HOC
- Higher-order component để bảo vệ các trang cụ thể
- Có thể tùy chỉnh hành vi chuyển hướng

## Cách sử dụng:

### Sử dụng useAuth Hook:
```tsx
import useAuth from '../hooks/useAuth';

const MyComponent = () => {
  const { isAuthenticated, logout, requireAuth } = useAuth();
  
  const handleSecureAction = () => {
    if (requireAuth()) {
      // Thực hiện hành động yêu cầu xác thực
    }
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Đăng xuất</button>
      ) : (
        <p>Vui lòng đăng nhập</p>
      )}
    </div>
  );
};
```

### Sử dụng withAuth HOC:
```tsx
import withAuth from '../components/auth/withAuth';

const ProtectedPage = () => {
  return <div>Nội dung được bảo vệ</div>;
};

export default withAuth(ProtectedPage);
```

## Route được bảo vệ:
- `/account/*` - Tất cả trang tài khoản
- `/balance/*` - Tất cả trang số dư

## Route công khai:
- `/` - Trang chủ
- `/homepage` - Trang chủ
- `/login` - Đăng nhập (chuyển hướng nếu đã đăng nhập)
- `/register` - Đăng ký (chuyển hướng nếu đã đăng nhập)