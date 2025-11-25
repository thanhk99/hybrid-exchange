"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import AuthService from "@/src/services/auth";
import { Notification } from "../../common/Notification/Notification";
import {
    EyeOutlined,
    EyeInvisibleOutlined,
    UserOutlined,
    LockOutlined,
    MailOutlined,
    FacebookOutlined,
    TwitterOutlined,
    GoogleOutlined
} from "@ant-design/icons";
import { FaSpinner } from "react-icons/fa";
import styles from './Register.module.css';
import { RegisterData } from "@/src/types/auth";

type NotificationState = {
    isVisible: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
};

export default function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState<NotificationState>({
        isVisible: false,
        type: 'info',
        title: '',
        message: ''
    });

    const router = useRouter();
    const authService = new AuthService();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<RegisterData>();

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

    const goToLogin = () => {
        router.push("/login");
    };

    const onSubmit = async (data: RegisterData) => {
        setIsLoading(true);
        showInfo("Thông tin", "Đang xử lý đăng ký...");

        try {
            await authService.register(data);
            showSuccess("Thành công", "Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");

            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (err: any) {
            console.error("Register error:", err);
            const errorMessage = err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
            showError("Lỗi đăng ký", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.registerPage}>
            {/* Notification Component */}
            <Notification
                type={notification.type}
                title={notification.title}
                message={notification.message}
                isVisible={notification.isVisible}
                onClose={hideNotification}
                duration={3000}
            />

            <div className={styles.leftSight}>
                <div className={styles.leftContent}>
                    <img src="/imgs/logo.jfif" alt="Logo" />
                </div>
            </div>

            <div className={styles.register}>
                <h2>Đăng ký</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Name Field */}
                    <div className={styles.inputForm}>
                        <UserOutlined className={styles.iconLeft} />
                        <input
                            type="text"
                            placeholder="Họ và tên"
                            {...register("name", {
                                required: "Họ và tên là bắt buộc",
                                minLength: {
                                    value: 2,
                                    message: "Họ và tên phải có ít nhất 2 ký tự"
                                }
                            })}
                        />
                    </div>
                    {errors.name && <span className={styles.errorMessage}>{errors.name.message}</span>}

                    {/* Email Field */}
                    <div className={styles.inputForm}>
                        <MailOutlined className={styles.iconLeft} />
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
                    </div>
                    {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}

                    {/* Password Field */}
                    <div className={styles.inputForm}>
                        <LockOutlined className={styles.iconLeft} />
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
                            className={styles.iconRight}
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ cursor: 'pointer' }}
                        >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </span>
                    </div>
                    {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}

                    {/* Submit Button */}
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <FaSpinner className={styles.spin} />
                                Đang đăng ký...
                            </>
                        ) : (
                            "Đăng ký"
                        )}
                    </button>

                    {/* Login Link */}
                    <div className={styles.routeLogin} onClick={goToLogin}>
                        Đã có tài khoản? Đăng nhập ngay
                    </div>
                </form>

                {/* Social Login */}
                <div className={styles.bottomIcon}>
                    <p>Hoặc đăng ký với</p>
                    <div className={styles.icons}>
                        <FacebookOutlined />
                        <TwitterOutlined />
                        <GoogleOutlined />
                    </div>
                </div>
            </div>
        </div>
    );
}
