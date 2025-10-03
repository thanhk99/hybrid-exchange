"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/app/lib/api/springboot-api/auth";
import { EyeOutlined, EyeInvisibleOutlined, MailOutlined, CompassOutlined, DownOutlined } from "@ant-design/icons";
import { UserOutlined, LockOutlined, CopyOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import "./RegisterForm.css";
import { FaSpinner } from "react-icons/fa";
import ButtonDropdown, { type BtnDropdownItem } from "@/app/components/shared/dropdown-btn/Btn"
import { useNotification } from "@/app/components/shared/Notification";

type FormValues = {
  email: string;
  username: string;
  password: string;
  nation: string;
};

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedNation, setSelectedNation] = useState<string>("");
  const router = useRouter();
  const { showSuccess, showError, showInfo, showWarning } = useNotification();

  const goToLogin = () => {
    router.push("/login");
  };

  const copied = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess("Thành công", "Đã sao chép vào clipboard");
      return true;
    } catch (err) {
      showError("Lỗi", "Không thể sao chép");
      return false;
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    // Kiểm tra validation trước khi submit
    if (!data.nation) {
      showWarning("Cảnh báo", "Vui lòng chọn quốc gia");
      return;
    }

    if (data.password.length < 6) {
      showWarning("Cảnh báo", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (!data.email || !data.username) {
      showWarning("Cảnh báo", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsLoading(true);
    showInfo("Thông tin", "Đang xử lý đăng ký...");
    
    try {
      const response = await AuthService.signup(
        data.email,
        data.username,
        data.password,
        data.nation
      );

      const responseData = response.data;
      
      // Kiểm tra response theo đúng format API trả về
      if (responseData.success === true) {
        showSuccess("Thành công", responseData.message || "Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
        
        // Reset form
        setValue("email", "");
        setValue("username", "");
        setValue("password", "");
        setValue("nation", "");
        setSelectedNation("");

        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        // Nếu success = false nhưng vẫn có message
        showError("Lỗi", responseData.message || "Đăng ký không thành công");
      }

    } catch (err: any) {
      console.error("Registration error:", err);
      

      // Xử lý các loại lỗi khác nhau
      if (err.response?.status === 409) {
        showError("Lỗi đăng ký", "Email hoặc username đã tồn tại");
      } else if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.message || "Dữ liệu không hợp lệ";
        showError("Lỗi đăng ký", errorMessage);
      } else if (err.response?.status === 500) {
        showError("Lỗi server", "Lỗi máy chủ. Vui lòng thử lại sau.");
      } else if (err.response?.data?.message) {
        showError("Lỗi đăng ký", err.response.data.message);
      } else if (err.message) {
        showError("Lỗi đăng ký", err.message);
      } else {
        showError("Lỗi đăng ký", "Đăng ký thất bại. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const nation: BtnDropdownItem[] = [
    {
      label: "Viet Nam",
      onClick: () => {},
    },
    {
      label: "Germany",
      onClick: () => {},
    },
    {
      label: "Russia",
      onClick: () => {},
    },
    {
      label: "China",
      onClick: () => {},
    },
    {
      label: "USA",
      onClick: () => {} 
    },
    {
      label: "United Kingdom",
      onClick: () => {},
    },
  ];

  const handleNationSelect = (nation: string) => {
    setValue("nation", nation);
    setSelectedNation(nation);
  };

  return (
    <div className="login-page">
      <div className="left-sight">
        <div className="left-content">
          <img src="imgs/logo.jfif" alt="ava" />
        </div>
      </div>

      <div className="login">
        <h2>Đăng ký</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-form">
            <MailOutlined className="icon-left"/>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { 
                required: "Email là bắt buộc",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email không hợp lệ"
                }
              })}
            />
            <CopyOutlined
              onClick={() => {
                const emailValue = getValues("email");
                if (emailValue?.trim() !== "") {
                  copied(emailValue);
                } else {
                  showError("Lỗi", "Không có nội dung để sao chép");
                }
              }}
              className="icon-right"
            />
          </div>
          {errors.email && <span className="error-message">{errors.email.message}</span>}

          <div className="input-form">
            <UserOutlined className="icon-left" />
            <input
              type="text"
              placeholder="Username"
              {...register("username", { 
                required: "Username là bắt buộc",
                minLength: {
                  value: 3,
                  message: "Username phải có ít nhất 3 ký tự"
                }
              })}
            />
            <CopyOutlined
              onClick={() => {
                const usernameValue = getValues("username");
                if (usernameValue?.trim() !== "") {
                  copied(usernameValue);
                } else {
                  showError("Lỗi", "Không có nội dung để sao chép");
                }
              }}
              className="icon-right"
            />
          </div>
          {errors.username && <span className="error-message">{errors.username.message}</span>}

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
            >
              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </span>
          </div>
          {errors.password && <span className="error-message">{errors.password.message}</span>}

          <div className="nation-section">
            <ButtonDropdown
              label={selectedNation || "Chọn quốc gia"}
              onClick={() => {}}
              iconleft={<CompassOutlined />}
              items={nation}
              iconright={<DownOutlined />}
              onSelect={handleNationSelect}
            />
            {!selectedNation && <span className="error-message">Vui lòng chọn quốc gia</span>}
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Đang xử lý...
              </>
            ) : (
              "Đăng ký"
            )}
          </button>
          <div className="route-regis" onClick={goToLogin}>
            Have an account ?
          </div>
        </form>
      </div>
    </div>
  );
}