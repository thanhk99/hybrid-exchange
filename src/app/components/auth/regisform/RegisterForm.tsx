"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/app/lib/api/springboot-api/auth";
import TokenService from "@/app/lib/api/springboot-api/token";
import { EyeOutlined, EyeInvisibleOutlined, MailOutlined, CompassOutlined } from "@ant-design/icons";
import { UserOutlined, LockOutlined, CopyOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import type { AppDispatch } from "@/app/store/store";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { data } from "react-router-dom";
import "./RegisterForm.css";
import { FaSpinner } from "react-icons/fa";

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
      const response = await AuthService.signup(
        data.email,
        data.username,
        data.password,
        data.nation
      );

      const payload = response.data;
      console.log(payload);

      if(payload.email && payload.id && payload.username){
        toast.success('Đăng ký thành công')
        router.push('/login')
      }

    } catch (err: any) {
      console.error("Regis error:", err);
      toast.error(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setIsLoading(false);
    }
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

          <div className="input-form">
            <CompassOutlined className="icon-left"/>
            <input
              type="text"
              placeholder="Nation"
              {...register("nation", { required: "Nation is required" })}
            />
            <CopyOutlined
              onClick={() => {
                const nationValue = getValues("nation");
                if (nationValue?.trim() !== "") {
                  copied(nationValue);
                } else {
                  toast.error("Copy failed");
                }
              }}
              className="icon-right"
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
