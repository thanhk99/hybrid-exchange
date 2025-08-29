"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/app/lib/api/springboot-api/auth";
import TokenService from "@/app/lib/api/springboot-api/token";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { UserOutlined, LockOutlined, CopyOutlined } from "@ant-design/icons";
import {
  FacebookOutlined,
  TwitterOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import type { AppDispatch } from "@/app/store/store";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { data } from "react-router-dom";
import { loginSuccess } from "@/app/store/authSlice";
import './LoginForm.css'
import { FaSpinner } from "react-icons/fa";

type FormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const goToRegis = () => {
    router.push("register");
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
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(data.email, data.password);

      const payload = response.data;
      console.log(payload);

      dispatch(
        loginSuccess({
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          userId: payload.userId,
          email: payload.email,
          deviceInfo: payload.deviceInfo,
        })
      );

      TokenService.setToken(payload.accessToken, payload.refreshToken);

      router.push("/");
      router.refresh();
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    // e.preventDefault()
    // setIsLoading(true)
    // setError('')
    // try {
    //   const response = await AuthService.login(email, password)
    //   console.log(response);
    //   // 1. Lưu token
    //   TokenService.setToken(response.accessToken, response.refreshToken)
    //   // 2. Kích hoạt sự kiện để Header biết cần reload
    //   window.dispatchEvent(new Event('authChange'))
    //   // 3. Chuyển hướng
    //   router.push('/')
    //   router.refresh() // Đảm bảo refresh client-side
    // } catch (err: any) {
    //   console.error('Login error:', err)
    //   setError(err.response?.data?.message || 'Đăng nhập thất bại')
    // } finally {
    //   setIsLoading(false)
    // }
  };

  return (
    <div className="login-page">
      <div className="left-sight">
        <div className="left-content">{/* <img src={ava} alt="ava" /> */}</div>
        <div className="route-regis" onClick={goToRegis}>
          Create an acount
        </div>
      </div>

      <div className="login">
        <h2>Đăng nhập</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
      <div className="input-form">
        <UserOutlined className="icon-left" />
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

      {/* <Checkbox {...register("remember")}>Remember me</Checkbox> */}

      <button type="submit">
        {isLoading ? (
          <FaSpinner className="animate-spin mr-2" />
        ) : (
          "Đăng nhập"
        )}
      </button>
    </form>

        <div className="bottom-icon">
          <p>Or login with </p>
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


