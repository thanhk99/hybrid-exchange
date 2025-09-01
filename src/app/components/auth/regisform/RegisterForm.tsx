"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/app/lib/api/springboot-api/auth";
import TokenService from "@/app/lib/api/springboot-api/token";
import { EyeOutlined, EyeInvisibleOutlined, MailOutlined, CompassOutlined, DownOutlined } from "@ant-design/icons";
import { UserOutlined, LockOutlined, CopyOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
// import type { AppDispatch } from "@/app/store/store";
// import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import "./RegisterForm.css";
import { FaSpinner } from "react-icons/fa";
import ButtonDropdown, { type BtnDropdownItem } from "@/app/component/shared/dropdown-btn/Btn"
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

  const goToLogin = () => {
    router.push("/login");
  };

  const copied = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied");
      return true;
    } catch (err) {
      toast.error("Copy failed");
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
    setIsLoading(true);
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
        router.push('/login');
        router.refresh(); 
      }

    } catch (err: any) {
      console.error("Regis error:", err);
      toast.error(err.response?.data?.message || "Đăng ký thất bại");
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
                  toast.error("Copy failed");
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
                  toast.error("Copy failed");
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
