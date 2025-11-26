"use client";

import { useState } from "react";
import {
  UserOutlined,
  ApiOutlined,
  BankOutlined,
  ControlOutlined,
  DownOutlined,
  EuroCircleOutlined,
  FundOutlined,
  HomeOutlined,
  SafetyOutlined,
  SwapOutlined,
  SwitcherOutlined,
  ThunderboltOutlined,
  TransactionOutlined,
  CreditCardOutlined,
  LogoutOutlined,
  LoginOutlined,
  PoweroffOutlined,
  PieChartOutlined,
  MenuOutlined,
  CloseOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import HeaderItem, { type IChildrenItem } from "./Item/Item";
import styles from "./Header.module.css";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/src/app/store/store";
import { logout } from "@/src/app/store/authSlice";

export default function Header() {
  const router = useRouter();
  const { email, userId, isAuthenticated } = useSelector(
    (state: any) => state.auth
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
    closeMenu();
  };

  const regisPage = () => {
    router.push("register");
    closeMenu();
  };

  const loginPage = () => {
    router.push("/login");
    closeMenu();
  };

  // Menu data
  const buyCrypto: IChildrenItem[] = [
    {
      icon: <SwapOutlined />,
      label: "Giao dịch P2P",
      content: "Mua/bán không mất phí giao dịch thông qua hơn 100 phương thức thanh toán",
      onClick: () => { router.push("/p2p"); closeMenu(); },
    },
  ];

  const explore: IChildrenItem[] = [
    {
      icon: <FundOutlined />,
      label: "Thị trường",
      content: "Xem giá, khối lượng và dữ liệu tiền mã hóa mới nhất",
      onClick: () => { closeMenu(); },
    },
    {
      icon: <ControlOutlined />,
      label: "Cơ hội",
      content: "Khám phá những loại tiền mã hóa mới và thịnh hành",
      onClick: () => { closeMenu(); },
    },
  ];

  const transfer: IChildrenItem[] = [
    {
      icon: <ThunderboltOutlined />,
      label: "Chuyển đổi",
      content: "Chuyển đổi nhanh, không mất phí giao dịch, không trượt giá",
      onClick: () => { closeMenu(); },
    },
    {
      icon: <TransactionOutlined />,
      label: "Spot",
      content: "Mua và bán Crypto dễ dàng",
      onClick: () => { closeMenu(); },
    },
    {
      icon: <SwitcherOutlined />,
      label: "Futures",
      content: "Giao dịch futures vĩnh cửu và đáo hạn bằng đòn bẩy",
      onClick: () => { closeMenu(); },
    },
  ];

  const growth: IChildrenItem[] = [
    {
      icon: <EuroCircleOutlined />,
      label: "Earn",
      content: "Đừng chỉ nắm giữ hãy tích luỹ",
      onClick: () => { closeMenu(); },
    },
    {
      icon: <BankOutlined />,
      label: "Vay",
      content: "Vay để kiếm tiền, vay để chi tiêu",
      onClick: () => { closeMenu(); },
    },
  ];

  const organize: IChildrenItem[] = [
    {
      icon: <HomeOutlined />,
      label: "Trang chủ tổ chức",
      content: "Bộ giải pháp giao dịch mã hoá mạnh mẽ",
      onClick: () => { closeMenu(); },
    },
    {
      icon: <ApiOutlined />,
      label: "API",
      content: "Khả năng kết nối API liền mạch và độ trễ cực thấp",
      onClick: () => { closeMenu(); },
    },
  ];

  const asset: IChildrenItem[] = [
    {
      icon: <WalletOutlined />,
      label: "Tổng quan tài sản",
      content: "Xem tất cả tài sản của bạn",
      onClick: () => { router.push("/balance/overview"); closeMenu(); },
    },
    {
      icon: <SwapOutlined />,
      label: "Chuyển tiền",
      content: "Chuyển tiền nội bộ miễn phí",
      onClick: () => { router.push("/assets/transfer"); closeMenu(); },
    },
    {
      icon: <CreditCardOutlined />,
      label: "Nạp tiền",
      content: "Nạp tiền vào tài khoản",
      onClick: () => { router.push("/assets/deposit"); closeMenu(); },
    },
    {
      icon: <TransactionOutlined />,
      label: "Rút tiền",
      content: "Rút tiền từ tài khoản",
      onClick: () => { router.push("/assets/withdraw"); closeMenu(); },
    },
    {
      icon: <PieChartOutlined />,
      label: "Lịch sử giao dịch",
      content: "Xem lịch sử giao dịch của bạn",
      onClick: () => { router.push("/assets/history"); closeMenu(); },
    },
  ];

  const user: IChildrenItem[] = [
    {
      icon: <ApiOutlined />,
      label: "Tổng quan",
      content: "",
      onClick: () => { router.push("/account/profile"); closeMenu(); },
    },
    {
      icon: <UserOutlined />,
      label: "Thông tin",
      content: "",
      onClick: () => { router.push("/account/profile"); closeMenu(); },
    },
    {
      icon: <SafetyOutlined />,
      label: "Cài đặt bảo mật",
      content: "",
      onClick: () => { router.push("/account/security"); closeMenu(); },
    },
    {
      icon: <PoweroffOutlined />,
      label: "Đăng xuất",
      content: "",
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <header className={styles.headerMain}>
        <div className={styles.head}>
          <div className={styles.headerLeft}>
            <div className={styles.logo} onClick={() => router.push("/")}>
              <img src="/imgs/Logo-VIX.svg" alt="logo" className={styles.logoImg} />
            </div>

            <div className={styles.desktopMenu}>
              <HeaderItem
                label="Mua Crypto"
                onClick={() => { }}
                icon={<DownOutlined />}
                childrens={buyCrypto}
                mobile={false}
              />
              <HeaderItem
                label="Khám phá"
                onClick={() => { }}
                icon={<DownOutlined />}
                childrens={explore}
                mobile={false}
              />
              <HeaderItem
                label="Giao dịch"
                onClick={() => { }}
                icon={<DownOutlined />}
                childrens={transfer}
                mobile={false}
              />
              <HeaderItem
                label="Tăng trưởng"
                onClick={() => { }}
                icon={<DownOutlined />}
                childrens={growth}
                mobile={false}
              />
              <HeaderItem
                label="Tổ chức"
                onClick={() => { }}
                icon={<DownOutlined />}
                childrens={organize}
                mobile={false}
              />
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.desktopUserSection}>
              {isAuthenticated ? (
                <div className={styles.headerUser}>
                  <div className={styles.userAsset}>
                    <HeaderItem
                      label="Tài sản"
                      onClick={() => { }}
                      icon={<WalletOutlined />}
                      childrens={asset}
                      mobile={false}
                    />
                  </div>
                  <div className={styles.iconUser}>
                    <HeaderItem
                      label=""
                      onClick={() => { }}
                      icon={<UserOutlined />}
                      headerContent={
                        <div className={styles.dropdownExtra}>
                          <div className={styles.dropdownExtraEmail}>{email}</div>
                          <div className={styles.dropdownExtraUid}>UID: {userId}</div>
                          <span className={styles.dropdownExtraRole}>Người dùng thông thường</span>
                        </div>
                      }
                      childrens={user}
                      mobile={false}
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.headerBtn}>
                  <button className={styles.btnLogin} onClick={loginPage}>
                    <span>Đăng nhập</span>
                  </button>
                  <button className={styles.btnRegister} onClick={regisPage}>
                    <span>Đăng ký</span>
                  </button>
                </div>
              )}
            </div>

            <button
              className={isMenuOpen ? styles.hamburgerOpen : styles.hamburger}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <div className={styles.hamburgerInner}>
                {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
              </div>
            </button>
          </div>
        </div>
      </header>

      <div className={isMenuOpen ? styles.overlayActive : styles.mobileOverlay} onClick={closeMenu}></div>

      <div className={isMenuOpen ? styles.menuActive : styles.mobileMenu}>
        <div className={styles.mobileHeader}>
          <div className={styles.mobileLogo}>
            <img src="/imgs/Logo-VIX.svg" alt="logo" />
            <span>VIX Trading</span>
          </div>
          <button className={styles.mobileClose} onClick={closeMenu}>
            <CloseOutlined />
          </button>
        </div>

        <div className={styles.mobileContent}>
          {isAuthenticated && (
            <div className={styles.mobileUserInfo}>
              <div className={styles.userAvatar}>
                <UserOutlined />
              </div>
              <div className={styles.userDetails}>
                <div className={styles.userEmail}>{email}</div>
                <div className={styles.userUid}>UID: {userId}</div>
              </div>
            </div>
          )}

          <nav className={styles.mobileNav}>
            <div className={styles.navSection}>
              <HeaderItem
                label="Mua Crypto"
                onClick={() => { }}
                icon={<SwapOutlined />}
                childrens={buyCrypto}
                trigger="click"
                mobile={true}
              />
              <HeaderItem
                label="Khám phá"
                onClick={() => { }}
                icon={<FundOutlined />}
                childrens={explore}
                trigger="click"
                mobile={true}
              />
              <HeaderItem
                label="Giao dịch"
                onClick={() => { }}
                icon={<TransactionOutlined />}
                childrens={transfer}
                trigger="click"
                mobile={true}
              />
              <HeaderItem
                label="Tăng trưởng"
                onClick={() => { }}
                icon={<EuroCircleOutlined />}
                childrens={growth}
                trigger="click"
                mobile={true}
              />
              <HeaderItem
                label="Tổ chức"
                onClick={() => { }}
                icon={<HomeOutlined />}
                childrens={organize}
                trigger="click"
                mobile={true}
              />
            </div>

            {isAuthenticated && (
              <div className={styles.navSection}>
                <div className={styles.navTitle}>Tài khoản</div>
                <HeaderItem
                  label="Tài sản"
                  onClick={() => { }}
                  icon={<WalletOutlined />}
                  childrens={asset}
                  trigger="click"
                  mobile={true}
                />
                <HeaderItem
                  label="Tài khoản"
                  onClick={() => { }}
                  icon={<UserOutlined />}
                  childrens={user}
                  trigger="click"
                  mobile={true}
                />
              </div>
            )}
          </nav>

          <div className={styles.mobileActions}>
            {!isAuthenticated ? (
              <>
                <button className={styles.mobileActionBtnPrimary} onClick={loginPage}>
                  <LoginOutlined />
                  <span>Đăng nhập</span>
                </button>
                <button className={styles.mobileActionBtnSecondary} onClick={regisPage}>
                  <UserOutlined />
                  <span>Đăng ký</span>
                </button>
              </>
            ) : (
              <button className={styles.mobileActionBtnLogout} onClick={handleLogout}>
                <LogoutOutlined />
                <span>Đăng xuất</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}