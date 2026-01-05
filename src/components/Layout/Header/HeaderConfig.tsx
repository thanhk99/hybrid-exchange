import {
    SwapOutlined,
    FundOutlined,
    ControlOutlined,
    ThunderboltOutlined,
    TransactionOutlined,
    SwitcherOutlined,
    EuroCircleOutlined,
    BankOutlined,
    HomeOutlined,
    ApiOutlined,
    WalletOutlined,
    CreditCardOutlined,
    PieChartOutlined,
    UserOutlined,
    SafetyOutlined,
    PoweroffOutlined,
} from "@ant-design/icons";
import { type IChildrenItem } from "./Item/Item";
import { AppDispatch } from "@/src/app/store/store";
import { logout } from "@/src/app/store/authSlice";

export const getBuyCryptoMenu = (router: any, closeMenu: () => void): IChildrenItem[] => [
    {
        icon: <SwapOutlined />,
        label: "Giao dịch P2P",
        content: "Mua/bán không mất phí giao dịch thông qua hơn 100 phương thức thanh toán",
        onClick: () => { router.push("/p2p"); closeMenu(); },
    },
];

export const getExploreMenu = (router: any, closeMenu: () => void): IChildrenItem[] => [
    {
        icon: <FundOutlined />,
        label: "Thị trường",
        content: "Xem giá, khối lượng và dữ liệu tiền mã hóa mới nhất",
        onClick: () => { router.push("/markets"); closeMenu(); },
    },
    {
        icon: <ControlOutlined />,
        label: "Cơ hội",
        content: "Khám phá những loại tiền mã hóa mới và thịnh hành",
        onClick: () => { router.push("/markets"); closeMenu(); },
    },
];

export const getTransferMenu = (router: any, closeMenu: () => void): IChildrenItem[] => [
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

export const getGrowthMenu = (router: any, closeMenu: () => void): IChildrenItem[] => [
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

export const getOrganizeMenu = (router: any, closeMenu: () => void): IChildrenItem[] => [
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

export const getAssetMenu = (router: any, closeMenu: () => void): IChildrenItem[] => [
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

export const getUserMenu = (router: any, dispatch: AppDispatch, closeMenu: () => void): IChildrenItem[] => [
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
        onClick: () => {
            dispatch(logout());
            router.push("/");
            closeMenu();
        },
    },
];
