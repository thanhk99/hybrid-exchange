import {
    CloseOutlined,
    UserOutlined,
    LoginOutlined,
    LogoutOutlined,
    SwapOutlined,
    FundOutlined,
    TransactionOutlined,
    EuroCircleOutlined,
    HomeOutlined,
    WalletOutlined,
} from "@ant-design/icons";
import styles from "./Header.module.css";
import NotificationBell from "@/src/components/Notification/NotificationBell/NotificationBell";
import HeaderItem, { type IChildrenItem } from "./Item/Item";
import { useRouter } from "next/navigation";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    isAuthenticated: boolean;
    email: string;
    userId: string;
    handleLogout: () => void;
    loginPage: () => void;
    regisPage: () => void;
    buyCrypto: IChildrenItem[];
    explore: IChildrenItem[];
    transfer: IChildrenItem[];
    growth: IChildrenItem[];
    organize: IChildrenItem[];
    asset: IChildrenItem[];
    userMenu: IChildrenItem[];
}

const MobileMenu = ({
    isOpen,
    onClose,
    isAuthenticated,
    email,
    userId,
    handleLogout,
    loginPage,
    regisPage,
    buyCrypto,
    explore,
    transfer,
    growth,
    organize,
    asset,
    userMenu,
}: MobileMenuProps) => {
    const router = useRouter();

    return (
        <>
            <div
                className={`${styles.mobileOverlay} ${isOpen ? styles.overlayActive : ""}`}
                onClick={onClose}
            ></div>

            <div className={`${styles.mobileMenu} ${isOpen ? styles.menuActive : ""}`}>
                <div className={styles.mobileHeader}>
                    <div className={styles.mobileLogo} onClick={() => { router.push("/"); onClose(); }}>
                        <img src="/imgs/Logo-VIX.svg" alt="logo" />
                        <span>VIX Trading</span>
                    </div>
                    <div className={styles.mobileHeaderRight}>
                        {isAuthenticated && <NotificationBell />}
                        <button className={styles.mobileClose} onClick={onClose}>
                            <CloseOutlined />
                        </button>
                    </div>
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
                                    childrens={userMenu}
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
};

export default MobileMenu;
