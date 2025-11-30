"use client";

import { useState, useEffect } from "react";
import {
    DownOutlined,
    CheckCircleOutlined,
    SwapOutlined,
    DollarOutlined
} from "@ant-design/icons";
import { FaSpinner } from "react-icons/fa";
import { getAssetsOverview } from "@/src/services/balance";
import WalletService, { Currency, Transaction, WalletTransferRequest } from "@/src/services/wallet";
import { Notification } from "../../common/Notification/Notification";
import TransactionHistory from "../../common/TransactionHistory/TransactionHistory";
import styles from "./Transfer.module.css";

type WalletType = 'funding' | 'spot' | 'earn';

export default function Transfer() {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
    const [assetsData, setAssetsData] = useState<any>(null);
    const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

    // Wallet Transfer State
    const [fromWallet, setFromWallet] = useState<WalletType>('funding');
    const [toWallet, setToWallet] = useState<WalletType>('spot');

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
        fetchAssets();
    }, []);

    useEffect(() => {
        if (selectedCurrency) {
            fetchBalance(selectedCurrency.id);
        }
    }, [selectedCurrency, fromWallet, assetsData]);

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

            const currency = currencies.find(c => c.id === currencyId);
            if (!currency) return;

            const walletKey = fromWallet;
            const walletAssets = assetsData[walletKey]?.assets || [];

            const asset = walletAssets.find((a: any) =>
                a.currency?.toUpperCase() === currency.symbol.toUpperCase()
            );

            setBalance(asset ? (asset.balance ?? 0) : 0);
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
        setAmount("");
    };

    const getWalletName = (type: WalletType) => {
        switch (type) {
            case 'funding': return 'Ví Funding';
            case 'spot': return 'Ví Spot';
            case 'earn': return 'Ví Earn';
            default: return 'Ví';
        }
    };

    const handleTransferClick = () => {
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

        if (fromWallet === toWallet) {
            showNotification('error', 'Lỗi', 'Ví nguồn và ví đích không được trùng nhau');
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
            const request: WalletTransferRequest = {
                fromWallet: fromWallet.toUpperCase() as any,
                toWallet: toWallet.toUpperCase() as any,
                currency: selectedCurrency!.symbol,
                amount: parseFloat(amount)
            };
            const response = await WalletService.transferWallet(request);
            if (response.status === 200 || response.status === 201) {
                showNotification('success', 'Thành công', `Đã chuyển ${amount} ${selectedCurrency!.symbol} sang ${getWalletName(toWallet)}`);
            } else {
                throw new Error(response.data?.message || 'Chuyển tiền thất bại');
            }

            setAmount("");
            setShowConfirmation(false);
            fetchBalance(selectedCurrency!.id);
            fetchTransactionHistory();
        } catch (error: any) {
            console.error(error);
            showNotification('error', 'Lỗi', error.message || error.response?.data?.message || 'Giao dịch thất bại. Vui lòng thử lại.');
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

                {/* Step 2: Wallet Selection */}
                {selectedCurrency && (
                    <div className={styles.stepContainer}>
                        <div className={`${styles.stepHeader} ${fromWallet && toWallet && fromWallet !== toWallet ? styles.stepCompleted : styles.stepActive}`}>
                            <div className={styles.stepBadge}>
                                {fromWallet && toWallet && fromWallet !== toWallet ? <CheckCircleOutlined /> : '2'}
                            </div>
                            <span className={styles.stepTitle}>Chọn ví nguồn và ví đích</span>
                        </div>

                        <div className={styles.stepContent}>
                            <div className={styles.walletSelection}>
                                <div className={styles.walletGroup}>
                                    <label className={styles.label}>Từ ví</label>
                                    <select
                                        className={styles.walletSelect}
                                        value={fromWallet}
                                        onChange={(e) => {
                                            const newWallet = e.target.value as WalletType;
                                            setFromWallet(newWallet);
                                            if (newWallet === toWallet) setToWallet(fromWallet);
                                        }}
                                    >
                                        <option value="funding">Ví Funding</option>
                                        <option value="spot">Ví Spot</option>
                                        <option value="earn">Ví Earn</option>
                                    </select>
                                </div>

                                <div className={styles.swapIcon} onClick={handleSwapWallets}>
                                    <SwapOutlined />
                                </div>

                                <div className={styles.walletGroup}>
                                    <label className={styles.label}>Đến ví</label>
                                    <select
                                        className={styles.walletSelect}
                                        value={toWallet}
                                        onChange={(e) => {
                                            const newWallet = e.target.value as WalletType;
                                            setToWallet(newWallet);
                                            if (newWallet === fromWallet) setFromWallet(toWallet);
                                        }}
                                    >
                                        <option value="funding">Ví Funding</option>
                                        <option value="spot">Ví Spot</option>
                                        <option value="earn">Ví Earn</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Amount */}
                {selectedCurrency && fromWallet && toWallet && fromWallet !== toWallet && (
                    <div className={styles.stepContainer}>
                        <div className={`${styles.stepHeader} ${amount ? styles.stepCompleted : styles.stepActive}`}>
                            <div className={styles.stepBadge}>
                                {amount ? <CheckCircleOutlined /> : '3'}
                            </div>
                            <span className={styles.stepTitle}>Đặt số tiền chuyển</span>
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
                                className={styles.transferButton}
                                onClick={handleTransferClick}
                                disabled={isTransferring}
                            >
                                {isTransferring ? <FaSpinner className={styles.spin} /> : 'Chuyển tiền'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className={styles.modalOverlay} onClick={() => setShowConfirmation(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>Xác nhận chuyển tiền</h3>

                        <div className={styles.confirmRow}>
                            <span className={styles.confirmLabel}>Số tiền</span>
                            <span className={styles.confirmValue}>{amount} {selectedCurrency?.symbol}</span>
                        </div>

                        <div className={styles.confirmRow}>
                            <span className={styles.confirmLabel}>Từ</span>
                            <span className={styles.confirmValue}>{getWalletName(fromWallet)}</span>
                        </div>

                        <div className={styles.confirmRow}>
                            <span className={styles.confirmLabel}>Đến</span>
                            <span className={styles.confirmValue}>{getWalletName(toWallet)}</span>
                        </div>

                        <div className={styles.modalActions}>
                            <button className={styles.cancelButton} onClick={() => setShowConfirmation(false)}>Hủy</button>
                            <button className={styles.confirmButton} onClick={handleConfirmTransfer}>
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
