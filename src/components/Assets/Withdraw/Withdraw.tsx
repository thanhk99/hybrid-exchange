"use client";

import { useState, useEffect } from "react";
import {
    WalletOutlined,
    InfoCircleOutlined,
    CheckCircleOutlined,
    DollarOutlined,
    DownOutlined,
    WarningOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    NumberOutlined
} from "@ant-design/icons";
import { FaSpinner } from "react-icons/fa";
import { getAssetsOverview } from "@/src/services/balance";
import WalletService, { Currency, Network, Transaction } from "@/src/services/wallet";
import { Notification } from "../../common/Notification/Notification";
import TransactionHistory from "../../common/TransactionHistory/TransactionHistory";
import styles from "./Withdraw.module.css";

export default function Withdraw() {
    const [withdrawMethod, setWithdrawMethod] = useState<'onchain' | 'okx'>('onchain');
    const [recipientType, setRecipientType] = useState<'phone' | 'email' | 'uid' | 'sub_account'>('phone');

    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
    const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
    const [assetsData, setAssetsData] = useState<any>(null);

    // Form inputs
    const [address, setAddress] = useState("");
    const [recipientValue, setRecipientValue] = useState("");
    const [amount, setAmount] = useState("");

    const [balance, setBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Dropdowns
    const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
    const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);

    const [notification, setNotification] = useState({
        isVisible: false,
        type: 'success' as 'success' | 'error' | 'info',
        title: '',
        message: ''
    });

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [historyFilter, setHistoryFilter] = useState<'all' | 'withdraw'>('all');

    useEffect(() => {
        fetchAssets();
    }, []);

    useEffect(() => {
        fetchTransactionHistory();
    }, [historyFilter]);

    useEffect(() => {
        if (selectedCurrency) {
            fetchBalance(selectedCurrency.id);
            setSelectedNetwork(null);
            setAddress("");
            setRecipientValue("");
            setAmount("");
        }
    }, [selectedCurrency]);

    const fetchTransactionHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const filter = historyFilter === 'all' ? undefined : 'withdraw';
            const data = await WalletService.getTransactionHistory(filter);
            setTransactions(data);
        } catch (error) {
            console.error("Failed to fetch transaction history", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const fetchAssets = async () => {
        setIsLoading(true);
        try {
            const [currencyData, assetsData] = await Promise.all([
                WalletService.getCurrencies(),
                getAssetsOverview()
            ]);

            setAssetsData(assetsData);
            setCurrencies(currencyData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBalance = async (currencyId: string) => {
        try {
            if (!assetsData) return;
            // Find the currency symbol from the selected currency object or ID
            const currency = currencies.find(c => c.id === currencyId);
            if (!currency) return;

            const spotAssets = assetsData.spot?.assets || [];
            // Match by currency symbol (e.g. "USDT")
            const asset = spotAssets.find((a: any) => a.currency === currency.symbol);

            if (asset) {
                setBalance(asset.balance ?? 0);
            } else {
                setBalance(0);
            }
        } catch (error) {
            console.error("Failed to fetch balance", error);
        }
    };

    const handleCurrencySelect = (currency: Currency) => {
        setSelectedCurrency(currency);
        setSelectedNetwork(null);
        setIsCurrencyDropdownOpen(false);
        setIsNetworkDropdownOpen(false);
    };

    const handleNetworkSelect = (network: Network) => {
        setSelectedNetwork(network);
        setIsNetworkDropdownOpen(false);
    };

    const handleMaxClick = () => {
        if (selectedNetwork && withdrawMethod === 'onchain') {
            const fee = parseFloat(selectedNetwork.fee || "0");
            const maxAmount = Math.max(0, balance - fee);
            setAmount(maxAmount.toString());
        } else {
            setAmount(balance.toString());
        }
    };

    const handleWithdrawClick = () => {
        // Validation
        if (!selectedCurrency) {
            showNotification('error', 'Lỗi', 'Vui lòng chọn loại tiền');
            return;
        }

        if (withdrawMethod === 'onchain') {
            if (!selectedNetwork) {
                showNotification('error', 'Lỗi', 'Vui lòng chọn mạng lưới');
                return;
            }
            if (!address.trim()) {
                showNotification('error', 'Lỗi', 'Vui lòng nhập địa chỉ ví');
                return;
            }
        } else {
            if (!recipientValue.trim()) {
                showNotification('error', 'Lỗi', 'Vui lòng nhập thông tin người nhận');
                return;
            }
        }

        if (!amount || parseFloat(amount) <= 0) {
            showNotification('error', 'Lỗi', 'Vui lòng nhập số tiền hợp lệ');
            return;
        }

        if (parseFloat(amount) > balance) {
            showNotification('error', 'Lỗi', 'Số dư không đủ');
            return;
        }

        setShowConfirmation(true);
    };

    const showNotification = (type: 'success' | 'error' | 'info', title: string, message: string) => {
        setNotification({ isVisible: true, type, title, message });
    };

    const handleConfirmWithdraw = async () => {
        setIsWithdrawing(true);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            showNotification('success', 'Thành công', `Đã gửi yêu cầu rút ${amount} ${selectedCurrency!.symbol}`);

            // Reset form
            setAddress("");
            setRecipientValue("");
            setAmount("");
            setShowConfirmation(false);
            fetchBalance(selectedCurrency!.id);
        } catch (error) {
            showNotification('error', 'Lỗi', 'Rút tiền thất bại. Vui lòng thử lại.');
        } finally {
            setIsWithdrawing(false);
        }
    };

    const getRecipientPlaceholder = () => {
        switch (recipientType) {
            case 'phone': return 'Nhập số điện thoại';
            case 'email': return 'Nhập địa chỉ email';
            case 'uid': return 'Nhập UID';
            case 'sub_account': return 'Nhập tên tài khoản phụ';
            default: return '';
        }
    };

    const getRecipientIcon = () => {
        switch (recipientType) {
            case 'phone': return <PhoneOutlined className={styles.inputIcon} />;
            case 'email': return <MailOutlined className={styles.inputIcon} />;
            case 'uid': return <NumberOutlined className={styles.inputIcon} />;
            case 'sub_account': return <UserOutlined className={styles.inputIcon} />;
            default: return <UserOutlined className={styles.inputIcon} />;
        }
    };

    return (
        <div className={styles.withdrawContainer}>
            <Notification
                isVisible={notification.isVisible}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
            />

            <div className={styles.header}>
                <h1 className={styles.title}>Rút tiền</h1>
            </div>

            <div className={styles.content}>
                {/* Step 1: Currency Selection */}
                <div className={styles.stepContainer}>
                    <div className={`${styles.stepHeader} ${selectedCurrency ? styles.stepCompleted : styles.stepActive}`}>
                        <div className={styles.stepBadge}>
                            {selectedCurrency ? <CheckCircleOutlined /> : '1'}
                        </div>
                        <span className={styles.stepTitle}>Chọn tiền mã hóa</span>
                    </div>

                    <div className={styles.stepContent}>
                        <div className={styles.dropdownContainer}>
                            <button
                                className={styles.dropdownButton}
                                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                            >
                                {selectedCurrency ? (
                                    <div className={styles.selectedItem}>
                                        {selectedCurrency.icon ? (
                                            <img src={selectedCurrency.icon} alt={selectedCurrency.symbol} className={styles.selectedIcon} />
                                        ) : (
                                            <div className={styles.selectedIcon} style={{ background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                                {selectedCurrency.symbol[0]}
                                            </div>
                                        )}
                                        <span className={styles.selectedText}>{selectedCurrency.symbol}</span>
                                    </div>
                                ) : (
                                    <span className={styles.placeholder}>Chọn loại tiền...</span>
                                )}
                                <DownOutlined />
                            </button>

                            {isCurrencyDropdownOpen && (
                                <div className={styles.dropdownMenu}>
                                    {isLoading ? (
                                        <div className={styles.loading}><FaSpinner className={styles.spin} /></div>
                                    ) : (
                                        currencies.map((currency: Currency) => (
                                            <div
                                                key={currency.id}
                                                className={styles.dropdownItem}
                                                onClick={() => handleCurrencySelect(currency)}
                                            >
                                                {currency.icon ? (
                                                    <img src={currency.icon} alt={currency.symbol} className={styles.currencyIcon} />
                                                ) : (
                                                    <div className={styles.currencyIcon} style={{ background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                                        {currency.symbol[0]}
                                                    </div>
                                                )}
                                                <span>{currency.symbol} - {currency.name}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                        {selectedCurrency && (
                            <div className={styles.balanceInfo}>
                                Số dư khả dụng: <strong>{balance} {selectedCurrency.symbol}</strong>
                            </div>
                        )}
                    </div>
                </div>

                {/* Step 2: Destination */}
                {selectedCurrency && (
                    <div className={styles.stepContainer}>
                        <div className={`${styles.stepHeader} ${(withdrawMethod === 'onchain' && selectedNetwork && address) ||
                            (withdrawMethod === 'okx' && recipientValue)
                            ? styles.stepCompleted
                            : styles.stepActive
                            }`}>
                            <div className={styles.stepBadge}>
                                {(withdrawMethod === 'onchain' && selectedNetwork && address) ||
                                    (withdrawMethod === 'okx' && recipientValue)
                                    ? <CheckCircleOutlined />
                                    : '2'}
                            </div>
                            <span className={styles.stepTitle}>Đặt đích đến</span>
                        </div>

                        <div className={styles.stepContent}>
                            <div className={styles.tabs}>
                                <button
                                    className={`${styles.tab} ${withdrawMethod === 'onchain' ? styles.tabActive : ''}`}
                                    onClick={() => setWithdrawMethod('onchain')}
                                >
                                    Rút tiền on-chain
                                </button>
                                <button
                                    className={`${styles.tab} ${withdrawMethod === 'okx' ? styles.tabActive : ''}`}
                                    onClick={() => setWithdrawMethod('okx')}
                                >
                                    Người dùng OKX
                                </button>
                            </div>

                            {withdrawMethod === 'onchain' ? (
                                <>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Mạng</label>
                                        <div className={styles.dropdownContainer}>
                                            <button
                                                className={styles.dropdownButton}
                                                onClick={() => setIsNetworkDropdownOpen(!isNetworkDropdownOpen)}
                                            >
                                                {selectedNetwork ? (
                                                    <span className={styles.selectedText}>{selectedNetwork.name}</span>
                                                ) : (
                                                    <span className={styles.placeholder}>Chọn mạng lưới...</span>
                                                )}
                                                <DownOutlined />
                                            </button>

                                            {isNetworkDropdownOpen && (
                                                <div className={styles.dropdownMenu}>
                                                    {selectedCurrency.networks.map((network: Network) => (
                                                        <div
                                                            key={network.id}
                                                            className={styles.dropdownItem}
                                                            onClick={() => handleNetworkSelect(network)}
                                                        >
                                                            <span>{network.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {selectedNetwork && (
                                            <div className={styles.networkStats}>
                                                <div className={styles.stat}>
                                                    <span className={styles.statLabel}>Phí:</span>
                                                    <span className={styles.statValue}>{selectedNetwork.fee}</span>
                                                </div>
                                                <div className={styles.stat}>
                                                    <span className={styles.statLabel}>Đến:</span>
                                                    <span className={styles.statValue}>{selectedNetwork.estimatedTime}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {selectedNetwork && (
                                        <div className={styles.formGroup} style={{ marginTop: '20px' }}>
                                            <label className={styles.label}>Địa chỉ</label>
                                            <div className={styles.inputWrapper}>
                                                <input
                                                    type="text"
                                                    className={styles.input}
                                                    placeholder="Nhập địa chỉ hoặc chọn từ sổ địa chỉ"
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className={styles.subTabs}>
                                        <button
                                            className={`${styles.subTab} ${recipientType === 'phone' ? styles.subTabActive : ''}`}
                                            onClick={() => setRecipientType('phone')}
                                        >
                                            Số điện thoại
                                        </button>
                                        <button
                                            className={`${styles.subTab} ${recipientType === 'email' ? styles.subTabActive : ''}`}
                                            onClick={() => setRecipientType('email')}
                                        >
                                            Email
                                        </button>
                                        <button
                                            className={`${styles.subTab} ${recipientType === 'uid' ? styles.subTabActive : ''}`}
                                            onClick={() => setRecipientType('uid')}
                                        >
                                            UID
                                        </button>
                                        <button
                                            className={`${styles.subTab} ${recipientType === 'sub_account' ? styles.subTabActive : ''}`}
                                            onClick={() => setRecipientType('sub_account')}
                                        >
                                            Tài khoản phụ
                                        </button>
                                    </div>

                                    <div className={styles.inputWrapper}>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder={getRecipientPlaceholder()}
                                            value={recipientValue}
                                            onChange={(e) => setRecipientValue(e.target.value)}
                                        />
                                        {getRecipientIcon()}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 3: Amount */}
                {((withdrawMethod === 'onchain' && selectedNetwork && address) ||
                    (withdrawMethod === 'okx' && recipientValue)) && (
                        <div className={styles.stepContainer}>
                            <div className={`${styles.stepHeader} ${amount ? styles.stepCompleted : styles.stepActive}`}>
                                <div className={styles.stepBadge}>
                                    {amount ? <CheckCircleOutlined /> : '3'}
                                </div>
                                <span className={styles.stepTitle}>Đặt số tiền rút</span>
                            </div>

                            <div className={styles.stepContent}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                    <button className={styles.maxButton} onClick={handleMaxClick}>
                                        Tối đa
                                    </button>
                                </div>

                                <button
                                    className={styles.withdrawButton}
                                    onClick={handleWithdrawClick}
                                    disabled={isWithdrawing}
                                >
                                    {isWithdrawing ? <FaSpinner className={styles.spin} /> : 'Rút tiền'}
                                </button>
                            </div>
                        </div>
                    )}
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className={styles.modalOverlay} onClick={() => setShowConfirmation(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>Xác nhận rút tiền</h3>

                        <div className={styles.confirmRow}>
                            <span className={styles.confirmLabel}>Số tiền</span>
                            <span className={styles.confirmValue}>{amount} {selectedCurrency?.symbol}</span>
                        </div>

                        {withdrawMethod === 'onchain' ? (
                            <>
                                <div className={styles.confirmRow}>
                                    <span className={styles.confirmLabel}>Địa chỉ</span>
                                    <span className={styles.confirmValue}>{address}</span>
                                </div>
                                <div className={styles.confirmRow}>
                                    <span className={styles.confirmLabel}>Mạng</span>
                                    <span className={styles.confirmValue}>{selectedNetwork?.name}</span>
                                </div>
                                <div className={styles.confirmRow}>
                                    <span className={styles.confirmLabel}>Phí mạng</span>
                                    <span className={styles.confirmValue}>{selectedNetwork?.fee}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={styles.confirmRow}>
                                    <span className={styles.confirmLabel}>Người nhận</span>
                                    <span className={styles.confirmValue}>{recipientValue}</span>
                                </div>
                                <div className={styles.confirmRow}>
                                    <span className={styles.confirmLabel}>Loại</span>
                                    <span className={styles.confirmValue}>
                                        {recipientType === 'phone' ? 'Số điện thoại' :
                                            recipientType === 'email' ? 'Email' :
                                                recipientType === 'uid' ? 'UID' : 'Tài khoản phụ'}
                                    </span>
                                </div>
                            </>
                        )}

                        <div className={styles.modalActions}>
                            <button className={styles.cancelButton} onClick={() => setShowConfirmation(false)}>Hủy</button>
                            <button className={styles.confirmButton} onClick={handleConfirmWithdraw}>
                                {isWithdrawing ? <FaSpinner className={styles.spin} /> : 'Xác nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <TransactionHistory
                transactions={transactions}
                isLoading={isLoadingHistory}
                filter={historyFilter}
                onFilterChange={(filter) => setHistoryFilter(filter as 'all' | 'withdraw')}
                filterOptions={[
                    { value: 'all', label: 'Tất cả' },
                    { value: 'withdraw', label: 'Rút tiền' }
                ]}
            />
        </div>
    );
}
