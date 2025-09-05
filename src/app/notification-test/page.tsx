import NotificationDemo from '@/app/components/shared/Notification/NotificationDemo';

export default function NotificationTestPage() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Demo Hệ thống Thông báo</h1>
      <p>Nhấn vào các nút bên dưới để test các loại thông báo:</p>
      <NotificationDemo />
      
      <div style={{ marginTop: '40px' }}>
        <h2>Các tính năng của hệ thống thông báo:</h2>
        <ul>
          <li><strong>4 loại thông báo:</strong> Thông tin, Thành công, Cảnh báo, Lỗi</li>
          <li><strong>Animation:</strong> Hiệu ứng slide-in từ bên phải</li>
          <li><strong>Auto-dismiss:</strong> Tự động ẩn sau 5 giây</li>
          <li><strong>Progress bar:</strong> Thanh tiến trình hiển thị thời gian còn lại</li>
          <li><strong>Manual close:</strong> Có thể đóng thủ công bằng nút X</li>
          <li><strong>Responsive:</strong> Tương thích với mobile</li>
          <li><strong>Dark mode:</strong> Hỗ trợ chế độ tối</li>
          <li><strong>Multiple notifications:</strong> Có thể hiển thị nhiều thông báo cùng lúc</li>
        </ul>
      </div>
    </div>
  );
}
