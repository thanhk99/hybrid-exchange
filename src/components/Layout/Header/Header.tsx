"use client";

import {
  UserOutlined,
  DownOutlined,
  WalletOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import HeaderItem from "./Item/Item";
import styles from "./Header.module.css";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/src/app/store/store";
import NotificationBell from "@/src/components/Notification/NotificationBell/NotificationBell";
import { useHeaderMenu } from "./useHeaderMenu";
import HeaderLogo from "./HeaderLogo";
import MobileMenu from "./MobileMenu";
import * as HeaderConfig from "./HeaderConfig";

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { email, userId, isAuthenticated } = useSelector((state: any) => state.auth);
  const { isMenuOpen, toggleMenu, closeMenu } = useHeaderMenu();

  // Menu data from config
  const buyCrypto = HeaderConfig.getBuyCryptoMenu(router, closeMenu);
  const explore = HeaderConfig.getExploreMenu(router, closeMenu);
  const transfer = HeaderConfig.getTransferMenu(router, closeMenu);
  const growth = HeaderConfig.getGrowthMenu(router, closeMenu);
  const organize = HeaderConfig.getOrganizeMenu(router, closeMenu);
  const asset = HeaderConfig.getAssetMenu(router, closeMenu);
  const userMenu = HeaderConfig.getUserMenu(router, dispatch, closeMenu);

  const regisPage = () => {
    router.push("/register");
    closeMenu();
  };

  const loginPage = () => {
    router.push("/login");
    closeMenu();
  };

  return (
    <>
      <header className={styles.headerMain}>
        <div className={styles.head}>
          <div className={styles.headerLeft}>
            <HeaderLogo />

            <div className={styles.desktopMenu}>
              <HeaderItem label="Mua Crypto" onClick={() => { }} icon={<DownOutlined />} childrens={buyCrypto} />
              <HeaderItem label="Khám phá" onClick={() => { }} icon={<DownOutlined />} childrens={explore} />
              <HeaderItem label="Giao dịch" onClick={() => { }} icon={<DownOutlined />} childrens={transfer} />
              <HeaderItem label="Tăng trưởng" onClick={() => { }} icon={<DownOutlined />} childrens={growth} />
              <HeaderItem label="Tổ chức" onClick={() => { }} icon={<DownOutlined />} childrens={organize} />
            </div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.desktopUserSection}>
              {isAuthenticated ? (
                <div className={styles.headerUser}>
                  <NotificationBell />
                  <div className={styles.userAsset}>
                    <HeaderItem label="Tài sản" onClick={() => { }} icon={<WalletOutlined />} childrens={asset} align="right" />
                  </div>
                  <div className={styles.iconUser}>
                    <HeaderItem
                      label=""
                      onClick={() => { }}
                      icon={<UserOutlined />}
                      align="right"
                      headerContent={
                        <div className={styles.dropdownExtra}>
                          <div className={styles.dropdownExtraEmail}>{email}</div>
                          <div className={styles.dropdownExtraUid}>UID: {userId}</div>
                          <span className={styles.dropdownExtraRole}>Người dùng thông thường</span>
                        </div>
                      }
                      childrens={userMenu}
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

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        isAuthenticated={isAuthenticated}
        email={email}
        userId={userId}
        handleLogout={() => { }} // Logout is handled inside UserConfig callback
        loginPage={loginPage}
        regisPage={regisPage}
        buyCrypto={buyCrypto}
        explore={explore}
        transfer={transfer}
        growth={growth}
        organize={organize}
        asset={asset}
        userMenu={userMenu}
      />
    </>
  );
}
