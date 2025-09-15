"use client";

import { useEffect, useState } from "react";
import {
  UserOutlined,
  ApiOutlined,
  BankOutlined,
  ControlOutlined,
  DollarOutlined,
  DownOutlined,
  EuroCircleOutlined,
  FundOutlined,
  HomeOutlined,
  SafetyOutlined,
  ShoppingCartOutlined,
  SwapOutlined,
  SwitcherOutlined,
  ThunderboltOutlined,
  TransactionOutlined,
  CreditCardOutlined,
  AuditOutlined,
  LogoutOutlined,
  LoginOutlined,
  PoweroffOutlined,
  PieChartOutlined,
  SettingOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import HeaderItem, { type IChildrenItem } from "./item/Item";
import "./Header.css";
import { useRouter } from "next/navigation";
import { useDispatch,useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store/store";
import { logout } from "@/app/store/authSlice";

export default function Header() {
  const router = useRouter();
  const { email, userId, isAuthenticated } = useSelector(
    (state: any) => state.auth
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setExpandedItem(null);
  };


  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () =>{
    dispatch(logout());
    router.push("/")
  }

  const regisPage = () =>{
    router.push('register')
  }

  const loginPage = () => {
    router.push("/login");
  };

  const buyCrypto: IChildrenItem[] = [
    {
      icon: <SwapOutlined />,
      label: "Giao dịch P2P",
      content:
        "Mua/bán không mất phí giao dịch thông qua hơn 100 phương thức thanh toán",
      onClick: () => {},
    },
  ];

  const explore: IChildrenItem[] = [
    {
      icon: <FundOutlined />,
      label: "Thị trường",
      content: "Xem giá, khối lượng và dữ liệu tiền mã hóa mới nhất",
      onClick: () => {},
    },
    {
      icon: <ControlOutlined />,
      label: "Cơ hội",
      content: "Khám phá những loại tiền mã hóa mới và thịnh hành",
      onClick: () => {},
    },
    {
      icon: <ShoppingCartOutlined />,
      label: "Thị trường",
      content: "Thu lợi nhuận cao cùng cộng đồng top trader",
      onClick: () => {},
    },
  ];

  const transfer: IChildrenItem[] = [
    {
      icon: <ThunderboltOutlined />,
      label: "Chuyển đổi",
      content: "Chuyển đổi nhanh, không mất phí giao dịch, không trượt giá",
      onClick: () => {},
    },
    {
      icon: <TransactionOutlined />,
      label: "Spot",
      content: "Mua và bán Crypto dễ dàng",
      onClick: () => {},
    },
    {
      icon: <SwitcherOutlined />,
      label: "Futures",
      content: "Giao dịch futures vĩnh cửu và đáo hạn bằng đòn bẩy",
      onClick: () => {},
    },
  ];

  const growth: IChildrenItem[] = [
    {
      icon: <EuroCircleOutlined />,
      label: "Earn",
      content: "Đừng chỉ nắm giữ hãy tích luỹ",
      onClick: () => {},
    },
    {
      icon: <BankOutlined />,
      label: "Vay",
      content: "Vay để kiếm tiền, vay để chi tiêu",
      onClick: () => {},
    },
  ];

  const organize: IChildrenItem[] = [
    {
      icon: <HomeOutlined />,
      label: "Trang chủ tổ chức",
      content: "Bộ giải pháp giao dịch mã hoá mạnh mẽ",
      onClick: () => {},
    },
    {
      icon: <ApiOutlined />,
      label: "API",
      content: "Khả năng kết nối API liền mạch và độ trễ cực thấp",
      onClick: () => {},
    },
  ];

  const moreinfor: IChildrenItem[] = [
    { icon: <DollarOutlined />, label: "xBTC", content: "", onClick: () => {} },
    {
      icon: <SafetyOutlined />,
      label: "Bảo mật quỹ tiền",
      content: "",
      onClick: () => {},
    },
  ];

  const asset: IChildrenItem[] = [
    {
      icon: <CreditCardOutlined />,
      label: "Tài sản của tôi",
      content: "",
      onClick: () => router.push("/balance/overview"),
    },
    {
      icon: <LoginOutlined />,
      label: "Nạp tiền",
      content: "",
      onClick: () => {},
    },
    {
      icon: <LogoutOutlined />,
      label: "Rút tiền",
      content: "",
      onClick: () => {},
    },
    {
      icon: <SwapOutlined />,
      label: "Chuyển tiền",
      content: "",
      onClick: () => {},
    },
    {
      icon: <AuditOutlined />,
      label: "Trung tâm lệnh",
      content: "",
      onClick: () => {},
    },
  ];

  const user: IChildrenItem[] = [
    {
      icon: <PieChartOutlined />,
      label: "Tổng quan",
      content: "",
      onClick: () => router.push("/account/overview"),
    },
    {
      icon: <UserOutlined />,
      label: "Thông tin",
      content: "",
      onClick: () => router.push("/account/profile"),
    },
    {
      icon: <SafetyOutlined />,
      label: "Cài đặt bảo mật",
      content: "",
      onClick: () => router.push("/account/security"),
    },
    {
      icon: <SettingOutlined />,
      label: "Tuỳ chọn",
      content: "",
      onClick: () => {},
    },
    { icon: <ApiOutlined />, label: "API", content: "", onClick: () => {} },
    {
      icon: <PoweroffOutlined />,
      label: "Đăng xuất",
      content: "",
      onClick:  handleLogout,
    },
  ];

  return (
    <header>
      <div className="header-left">
        <div className="logo">
          <img src="/imgs/iconnobg.png" alt="Logo" className="logo-img"/>
        </div>

        <HeaderItem
          label="Mua tiền mã hoá"
          onClick={() => {}}
          icon={<DownOutlined />}
          childrens={buyCrypto}
        />
        <HeaderItem
          label="Khám phá"
          onClick={() => {}}
          icon={<DownOutlined />}
          childrens={explore}
        />
        <HeaderItem
          label="Giao dịch"
          onClick={() => {}}
          icon={<DownOutlined />}
          childrens={transfer}
        />
        <HeaderItem
          label="Tăng trưởng"
          onClick={() => {}}
          icon={<DownOutlined />}
          childrens={growth}
        />
        <HeaderItem
          label="Tổ chức"
          onClick={() => {}}
          icon={<DownOutlined />}
          childrens={organize}
        />
        <HeaderItem
          label="Thêm"
          onClick={() => {}}
          icon={<DownOutlined />}
          childrens={moreinfor}
        />
      </div>
      <div className="header-right">
        {isAuthenticated ? (
          <div className="header-user">
            <div className="user-asset">
              <HeaderItem
                label="Tài sản"
                onClick={() => {}}
                icon={<DownOutlined />}
                childrens={asset}
              />
            </div>
            <div className="icon-user">
              <HeaderItem
                label=""
                onClick={() => {}}
                icon={<UserOutlined />}
                headerContent={
                  <div className="dropdown-extra">
                    <div className="dropdown-extra__email">{email}</div>
                    <div className="dropdown-extra__uid">UID: {userId}</div>
                    <span className="dropdown-extra__role">
                      Người dùng thông thường
                    </span>
                    <button className="dropdown-extra__switch-btn">
                      Chuyển đổi tài khoản phụ
                    </button>
                  </div>
                }
                childrens={user}
              />
            </div>
          </div>
        ) : (
          <div className="header-btn">
            <button onClick={loginPage}>Đăng nhập</button>
            <button onClick={regisPage}>Đăng ký</button>
            <button className="hamburger" onClick={toggleMenu}>
              <MenuOutlined />
            </button>
          </div>
        )}
        {isMenuOpen && (
          <div className="mobile-menu">
            <HeaderItem
              label="Mua tiền mã hoá"
              onClick={() => {}}
              icon={<DownOutlined />}
              childrens={buyCrypto}
            />
            <HeaderItem
              label="Khám phá"
              onClick={() => {}}
              icon={<DownOutlined />}
              childrens={explore}
            />
            <HeaderItem
              label="Giao dịch"
              onClick={() => {}}
              icon={<DownOutlined />}
              childrens={transfer}
            />
            <HeaderItem
              label="Tăng trưởng"
              onClick={() => {}}
              icon={<DownOutlined />}
              childrens={growth}
            />
            <HeaderItem
              label="Tổ chức"
              onClick={() => {}}
              icon={<DownOutlined />}
              childrens={organize}
            />
            <HeaderItem
              label="Thêm"
              onClick={() => {}}
              icon={<DownOutlined />}
              childrens={moreinfor}
            />
          </div>
        )}
      </div>
    </header>
  );
}
