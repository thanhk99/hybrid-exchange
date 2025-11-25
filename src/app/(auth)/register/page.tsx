import RegisterForm from "@/src/components/Auth/Register/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đăng ký | Hybrid Exchange",
    description: "Tạo tài khoản mới để bắt đầu giao dịch",
};

export default function RegisterPage() {
    return <RegisterForm />;
}
