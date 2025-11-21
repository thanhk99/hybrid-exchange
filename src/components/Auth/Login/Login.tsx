"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import AuthService from "@/src/services/auth";
import TokenService from "@/src/services/token";
// import deviceService from "@/app/services/deviceService";
import { Notification } from "../../common/Notification/Notification";
import { 
  EyeOutlined, 
  EyeInvisibleOutlined,
  UserOutlined, 
  LockOutlined, 
  CopyOutlined,
  FacebookOutlined,
  TwitterOutlined,
  GoogleOutlined
} from "@ant-design/icons";
import { FaSpinner } from "react-icons/fa";
import './LoginForm.css'

type NotificationState = {
  isVisible: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
};

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    type: 'info',
    title: '',
    message: ''
  });
  
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginData>();

  const showNotification = (type: NotificationState['type'], title: string, message: string) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const showSuccess = (title: string, message: string) => showNotification('success', title, message);
  const showError = (title: string, message: string) => showNotification('error', title, message);
  const showInfo = (title: string, message: string) => showNotification('info', title, message);

  const handleCopyEmail = async () => {
    const emailValue = getValues("email");
    if (emailValue?.trim() !== "") {
      try {
        await navigator.clipboard.writeText(emailValue);
        showSuccess("Thành công", "Đã sao chép email vào clipboard");
      } catch (err) {
        showError("Lỗi", "Không thể sao chép email");
      }
    } else {
      showError("Lỗi", "Không có email để sao chép");
    }
  };

  const goToRegister = () => {
    router.push("/register");
  };

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    showInfo("Thông tin", "Đang xử lý đăng nhập...");
    
    try {
      const response = await AuthService.login(data);
      const payload = response.data;

      // Lưu thông tin device và token
    //   deviceService.setDeviceId(payload.data.deviceInfo.deviceId);
    //   TokenService.setToken(payload.data.accessToken, payload.data.refreshToken);

      showSuccess("Thành công", "Đăng nhập thành công! Đang chuyển hướng...");
      
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      showError("Lỗi đăng nhập", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Notification Component */}
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        duration={3000}
      />

      <div className="left-sight">
        <div className="left-content">
          <img src="imgs/logo.jfif" alt="Logo" />
        </div>
      </div>

      <div className="login">
        <h2>Đăng nhập</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="input-form">
            <UserOutlined className="icon-left" />
            <input
              type="text"
              placeholder="Email"
              {...register("email", { 
                required: "Email là bắt buộc",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email không hợp lệ"
                }
              })}
            />
            <CopyOutlined
              onClick={handleCopyEmail}
              className="icon-right"
            />
          </div>
          {errors.email && <span className="error-message">{errors.email.message}</span>}

          {/* Password Field */}
          <div className="input-form">
            <LockOutlined className="icon-left" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              {...register("password", { 
                required: "Mật khẩu là bắt buộc",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự"
                }
              })}
            />
            <span
              className="icon-right"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer' }}
            >
              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </span>
          </div>
          {errors.password && <span className="error-message">{errors.password.message}</span>}

          {/* Submit Button */}
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>

          {/* Register Link */}
          <div className="route-regis" onClick={goToRegister}>
            Tạo tài khoản mới
          </div>
        </form>

        {/* Social Login */}
        <div className="bottom-icon">
          <p>Hoặc đăng nhập với</p>
          <div className="icons">
            <FacebookOutlined />
            <TwitterOutlined />
            <GoogleOutlined />
          </div>
        </div>
      </div>
    </div>
  );
}