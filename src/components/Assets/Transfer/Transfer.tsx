"use client";

import { useState, useEffect } from "react";
import {
    DownOutlined,
    DollarOutlined,
    InfoCircleOutlined,
    SwapOutlined,
    ArrowRightOutlined
} from "@ant-design/icons";
import { FaSpinner } from "react-icons/fa";
import WalletService, { Currency, Transaction } from "@/src/services/wallet";
import { Notification } from "../../common/Notification/Notification";
import TransactionHistory from "../../common/TransactionHistory/TransactionHistory";
import styles from "./Transfer.module.css";

type WalletType = 'funding' | 'trading';

export default function Transfer() {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
    const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

    // Wallet selection state
    const [fromWallet, setFromWallet] = useState<WalletType>('funding');
    const [toWallet, setToWallet] = useState<WalletType>('trading');

    const [amount, setAmount] = useState("");
    const [balance, setBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isTransferring, setIsTransferring] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [notification, setNotification] = useState({
        isVisible: false,
        type: 'success' as 'success' | 'error' | 'info',
        title: '',
        message: ''
    });

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [historyFilter, setHistoryFilter] = useState<'all' | 'transfer'>('all');

    useEffect(() => {
        fetchCurrencies();
    }, []);

    useEffect(() => {
        if (selectedCurrency) {
            fetchBalance(selectedCurrency.id);
        }
    }, [selectedCurrency, fromWallet]); // Refetch balance when currency or source wallet changes

    useEffect(() => {
        fetchTransactionHistory();
    }, [historyFilter]);

    const fetchTransactionHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const filter = historyFilter === 'all' ? undefined : 'transfer';
            const data = await WalletService.getTransactionHistory(filter);
            setTransactions(data);
        } catch (error) {
            console.error("Failed to fetch transaction history", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const fetchCurrencies = async () => {
        setIsLoading(true);
        try {
            const data = await WalletService.getCurrencies();
            setCurrencies(data);
        } catch (error) {
            console.error("Failed to fetch currencies", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBalance = async (currencyId: string) => {
        try {
            // In a real app, we would fetch balance specific to the 'fromWallet'
            // const balance = await WalletService.getBalance(currencyId, fromWallet);
            const balance = await WalletService.getBalance(currencyId);
            setBalance(balance);
        } catch (error) {
            console.error("Failed to fetch balance", error);
        }
    };

    const handleCurrencySelect = (currency: Currency) => {
        setSelectedCurrency(currency);
        setIsCurrencyDropdownOpen(false);
    };

    const handleMaxClick = () => {
        setAmount(balance.toString());
    };

    const handleSwapWallets = () => {
        setFromWallet(toWallet);
        setToWallet(fromWallet);
        // Reset amount as balance might be different
        setAmount("");
    };

    const getWalletName = (type: WalletType) => {
        return type === 'funding' ? 'Tài khoản Funding' : 'Tài khoản Giao dịch';
    };

    const handleTransferClick = () => {
        // Validation
        if (!selectedCurrency) {
            showNotification('error', 'Lỗi', 'Vui lòng chọn loại tiền');
            return;
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

    const handleConfirmTransfer = async () => {
        setIsTransferring(true);
        try {
            // Mock internal transfer API
            await new Promise(resolve => setTimeout(resolve, 1500));

            showNotification('success', 'Thành công', `Đã chuyển ${amount} ${selectedCurrency!.symbol} sang ${getWalletName(toWallet)}`);

            // Reset form
            setAmount("");
            setShowConfirmation(false);
            // Refresh balance
            fetchBalance(selectedCurrency!.id);
        } catch (error) {
            showNotification('error', 'Lỗi', 'Chuyển tiền thất bại. Vui lòng thử lại.');
        } finally {
            setIsTransferring(false);
        }
    };

    return (
        <div className={styles.transferContainer}>
            <Notification
                isVisible={notification.isVisible}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
            />

            <div className={styles.header}>
                <h1 className={styles.title}>Chuyển tiền</h1>
                <p className={styles.subtitle}>Chuyển tiền giữa các tài khoản của bạn</p>
            </div>

            <div className={styles.content}>
                <div className={styles.formSection}>
                    {/* Currency Selection */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Tài sản</label>
                        <div className={styles.dropdownContainer}>
                            <button
                                className={styles.dropdownButton}
                                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                            >
                                {selectedCurrency ? (
                                    <div className={styles.selectedItem}>
                                        <img src={selectedCurrency.icon} alt={selectedCurrency.symbol} className={styles.selectedIcon} />
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
                                        <div className={styles.loading}>
                                            <FaSpinner className={styles.spin} />
                                        </div>
                                    ) : (
                                        currencies.map(currency => (
                                            <div
                                                key={currency.id}
                                                className={styles.dropdownItem}
                                                onClick={() => handleCurrencySelect(currency)}
                                            >
                                                <img src={currency.icon} alt={currency.symbol} className={styles.currencyIcon} />
                                                <span>{currency.symbol} - {currency.name}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Wallet Selection (From -> To) */}
                    <div className={styles.formGroup}>
                        <div className={styles.walletSelector}>
                            <div className={styles.walletBox}>
                                <span className={styles.walletLabel}>Từ</span>
                                <span className={styles.walletName}>{getWalletName(fromWallet)}</span>
                            </div>

                            <button className={styles.swapButton} onClick={handleSwapWallets}>
                                <SwapOutlined />
                            </button>

                            <div className={styles.walletBox}>
                                <span className={styles.walletLabel}>Đến</span>
                                <span className={styles.walletName}>{getWalletName(toWallet)}</span>
                            </div>
                        </div>
                        {selectedCurrency && (
                            <div className={styles.balanceInfo}>
                                Số dư khả dụng: <strong>{balance} {selectedCurrency.symbol}</strong>
                            </div>
                        )}
                    </div>

                    {/* Amount */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Số tiền</label>
                        <div className={styles.inputWrapper}>
                            <DollarOutlined className={styles.inputIcon} />
                            <input
                                type="number"
                                className={styles.input}
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                step="0.01"
                                min="0"
                            />
                            <button className={styles.maxButton} onClick={handleMaxClick}>
                                Tối đa
                            </button>
                        </div>
                    </div>

                    {/* Transfer Info */}
                    <div className={styles.infoBox}>
                        <InfoCircleOutlined className={styles.infoIcon} />
                        <div className={styles.infoText}>
                            <p><strong>Thông tin:</strong></p>
                            <ul>
                                <li>Chuyển tiền giữa các tài khoản là miễn phí</li>
                                <li>Tiền sẽ được cập nhật ngay lập tức</li>
                            </ul>
                        </div>
                    </div>

                    {/* Transfer Button */}
                    <button
                        className={styles.transferButton}
                        onClick={handleTransferClick}
                        disabled={isTransferring}
                    >
                        {isTransferring ? <FaSpinner className={styles.spin} /> : 'Xác nhận'}
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className={styles.modalOverlay} onClick={() => setShowConfirmation(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>Xác nhận chuyển tiền</h3>
                        <div className={styles.modalContent}>
                            <div className={styles.confirmRow}>
                                <span className={styles.confirmLabel}>Từ:</span>
                                <span className={styles.confirmValue}>{getWalletName(fromWallet)}</span>
                            </div>
                            <div className={styles.confirmRow}>
                                <span className={styles.confirmLabel}>Đến:</span>
                                <span className={styles.confirmValue}>{getWalletName(toWallet)}</span>
                            </div>
                            <div className={styles.confirmRow}>
                                <span className={styles.confirmLabel}>Số tiền:</span>
                                <span className={styles.confirmValue}>{amount} {selectedCurrency?.symbol}</span>
                            </div>
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowConfirmation(false)}
                                disabled={isTransferring}
                            >
                                Hủy
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={handleConfirmTransfer}
                                disabled={isTransferring}
                            >
                                {isTransferring ? <FaSpinner className={styles.spin} /> : 'Xác nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <TransactionHistory
                transactions={transactions}
                isLoading={isLoadingHistory}
                filter={historyFilter}
                onFilterChange={(filter) => setHistoryFilter(filter as 'all' | 'transfer')}
                filterOptions={[
                    { value: 'all', label: 'Tất cả' },
                    { value: 'transfer', label: 'Chuyển tiền' }
                ]}
            />
        </div>
    );
}
