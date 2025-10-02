"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/app/lib/api/springboot-api/auth";
import TokenService from "@/app/lib/api/springboot-api/token";
import { EyeOutlined, EyeInvisibleOutlined, MailOutlined, CompassOutlined, DownOutlined } from "@ant-design/icons";
import { UserOutlined, LockOutlined, CopyOutlined } from "@ant-design/icons";
// import type { AppDispatch } from "@/app/store/store";
// import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import "./RegisterForm.css";
import { FaSpinner } from "react-icons/fa";
import ButtonDropdown, { type BtnDropdownItem } from "@/app/components/shared/dropdown-btn/Btn"
import { useNotification } from "@/app/components/shared/Notification";
type FormValues = {
  email: string;
  username: string;
  password: string;
  nation : string;
};

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  // const dispatch = useDispatch<AppDispatch>();
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
    reset,
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

    setIsLoading(true);
    showInfo("Thông tin", "Đang xử lý đăng ký...");
    
    try {
      const response = await AuthService.signup(
        data.email,
        data.username,
        data.password,
        data.nation
      );

      const payload = response.data;
      console.log(payload);

      if(payload.email && payload.id && payload.username){
        showSuccess("Thành công", "Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
        
        setTimeout(() => {
          router.push('/login');
          router.refresh();
        }, 2000);
      }

    } catch (err: any) {
      console.error("Regis error:", err);
      showError("Lỗi đăng ký", err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại sau.");
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

  return (
    <div className="login-page">
      <div className="left-sight">
        <div className="left-content">{/* <img src={ava} alt="ava" /> */}</div>
        <div className="route-regis" onClick={goToLogin}>
          Have an account ?
        </div>
      </div>

      <div className="login">
        <h2>Đăng ký</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-form">
            <MailOutlined className="icon-left"/>
            <input
              type="text"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
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

          <div className="input-form">
            <UserOutlined className="icon-left" />
            <input
              type="text"
              placeholder="Username"
              {...register("username", { required: "Username is required" })}
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

          <div className="input-form">
            <LockOutlined className="icon-left" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              {...register("password", { required: "Password is required" })}
            />
            <span
              className="icon-right"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </span>
          </div>

          <div>
            <ButtonDropdown
            label="Nation"
            onClick={() => {}}
            iconleft={<CompassOutlined />}
            items={nation}
            iconright = {<DownOutlined />}
            onSelect={(val) => {
              setValue("nation", val);
            }}
            />
          </div>

          <button type="submit">
            {isLoading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              "Đăng ký"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
