"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
    CopyOutlined,
    InfoCircleOutlined,
    CheckCircleOutlined,
    DownOutlined
} from "@ant-design/icons";
import { FaSpinner } from "react-icons/fa";
import WalletService, { Currency, Network, DepositAddress, Transaction } from "@/src/services/wallet";
import { Notification } from "../../common/Notification/Notification";
import CurrencySelector from "../../common/CurrencySelector/CurrencySelector";
import TransactionHistory from "../../common/TransactionHistory/TransactionHistory";
import styles from "./Deposit.module.css";
import { useUser } from "@/src/contexts/UserContext";

export default function Deposit() {
    const { user, loading: userLoading } = useUser();
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
    const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
    const [depositAddress, setDepositAddress] = useState<DepositAddress | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddressLoading, setIsAddressLoading] = useState(false);
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
    const [historyFilter, setHistoryFilter] = useState<'all' | 'deposit'>('all');
    const [walletBalance, setWalletBalance] = useState<any>(null);
    const [isBalanceLoading, setIsBalanceLoading] = useState(false);

    useEffect(() => {
        fetchCurrencies();
    }, []);

    useEffect(() => {
        fetchTransactionHistory();
    }, [historyFilter]);

    const fetchTransactionHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const filter = historyFilter === 'all' ? undefined : 'deposit';
            const data = await WalletService.getTransactionHistory(filter);
            setTransactions(data);
        } catch (error) {
            console.error("Failed to fetch transaction history", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (selectedCurrency && selectedNetwork) {
            fetchDepositAddress(selectedCurrency.id, selectedNetwork.id);
        } else {
            setDepositAddress(null);
        }
    }, [selectedCurrency, selectedNetwork, user, userLoading]);

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

    const fetchDepositAddress = async (currencyId: string, networkId: string) => {
        if (userLoading) return;
        setIsAddressLoading(true);
        try {
            console.log('fetchDepositAddress checking:', { networkId, currencyId, user });
            // Check if TRON network
            if (networkId.toLowerCase().includes('trc20') || networkId.toLowerCase() === 'tron') {
                const userId = user?.uid;
                console.log('TRC20 detected. UserId:', userId);

                if (userId) {
                    const wallet = await WalletService.getTronWallet(userId);
                    setDepositAddress({
                        address: wallet.address,
                        network: 'TRC20',
                        currency: 'USDT'
                    });
                    return;
                }
            }

            setNotification({
                isVisible: true,
                type: 'info',
                title: 'Thông báo',
                message: 'Hệ thống đang bảo trì kênh nạp này. Vui lòng quay lại sau.'
            });
            setDepositAddress(null);

        } catch (error) {
            console.error("Failed to fetch deposit address", error);
            setNotification({
                isVisible: true,
                type: 'error',
                title: 'Lỗi',
                message: 'Không thể lấy địa chỉ ví'
            });
            setDepositAddress(null);
        } finally {
            setIsAddressLoading(false);
        }
    };

    const checkBalance = async () => {
        if (!depositAddress?.address) return;
        setIsBalanceLoading(true);
        try {
            const balanceData = await WalletService.getTronBalance(depositAddress.address);
            setWalletBalance(balanceData);
            setNotification({
                isVisible: true,
                type: 'success',
                title: 'Thành công',
                message: 'Đã cập nhật số dư ví'
            });
        } catch (error) {
            console.error('Check balance error', error);
            setNotification({
                isVisible: true,
                type: 'error',
                title: 'Lỗi',
                message: 'Không thể kiểm tra số dư'
            });
        } finally {
            setIsBalanceLoading(false);
        }
    };

    const handleCurrencySelect = (currency: Currency) => {
        setSelectedCurrency(currency);
        setSelectedNetwork(null);
        setDepositAddress(null);
        setIsCurrencyDropdownOpen(false);
        setIsNetworkDropdownOpen(false);
    };

    const handleNetworkSelect = (network: Network) => {
        setSelectedNetwork(network);
        setIsNetworkDropdownOpen(false);
    };

    const handleCopy = async () => {
        if (depositAddress?.address) {
            try {
                await navigator.clipboard.writeText(depositAddress.address);
                setNotification({
                    isVisible: true,
                    type: 'success',
                    title: 'Đã sao chép',
                    message: 'Địa chỉ ví đã được sao chép vào clipboard'
                });
            } catch (err) {
                setNotification({
                    isVisible: true,
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Không thể sao chép địa chỉ'
                });
            }
        }
    };

    return (
        <div className={styles.depositContainer}>
            <Notification
                isVisible={notification.isVisible}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
            />

            <div className={styles.header}>
                <h1 className={styles.title}>Nạp tiền</h1>
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
                        <CurrencySelector
                            currencies={currencies}
                            selectedCurrency={selectedCurrency}
                            onSelect={handleCurrencySelect}
                            isOpen={isCurrencyDropdownOpen}
                            onToggle={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                        />
                    </div>
                </div>

                {/* Step 2: Network Selection */}
                {selectedCurrency && (
                    <div className={styles.stepContainer}>
                        <div className={`${styles.stepHeader} ${selectedNetwork ? styles.stepCompleted : styles.stepActive}`}>
                            <div className={styles.stepBadge}>
                                {selectedNetwork ? <CheckCircleOutlined /> : '2'}
                            </div>
                            <span className={styles.stepTitle}>Chọn mạng lưới</span>
                        </div>

                        <div className={styles.stepContent}>
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
                                        {selectedCurrency.networks?.map((network: Network) => (
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
                                    <div className={styles.stat}>
                                        <span className={styles.statLabel}>Tối thiểu:</span>
                                        <span className={styles.statValue}>{selectedNetwork.minDeposit}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 3: Deposit Address */}
                {selectedCurrency && selectedNetwork && (
                    <div className={styles.stepContainer}>
                        <div className={`${styles.stepHeader} ${depositAddress ? styles.stepCompleted : styles.stepActive}`}>
                            <div className={styles.stepBadge}>
                                {depositAddress ? <CheckCircleOutlined /> : '3'}
                            </div>
                            <span className={styles.stepTitle}>Địa chỉ nạp tiền</span>
                        </div>

                        <div className={styles.stepContent}>
                            {isAddressLoading ? (
                                <div className={styles.loadingState}>
                                    <FaSpinner className={styles.spin} />
                                    <p>Đang tạo địa chỉ ví...</p>
                                </div>
                            ) : depositAddress ? (
                                <>
                                    {/* QR Code */}
                                    <div className={styles.qrSection}>
                                        <div className={styles.qrWrapper}>
                                            <QRCodeSVG value={depositAddress.address} size={200} />
                                        </div>
                                        <p className={styles.qrLabel}>Quét mã QR để nạp tiền</p>
                                    </div>

                                    {/* Address */}
                                    <div className={styles.addressSection}>
                                        <label className={styles.addressLabel}>
                                            Địa chỉ nạp {selectedCurrency?.symbol}
                                        </label>
                                        <div className={styles.addressBox}>
                                            <span className={styles.addressText}>{depositAddress.address}</span>
                                            <button className={styles.copyBtn} onClick={handleCopy}>
                                                <CopyOutlined />
                                                <span>Sao chép</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Warning Box */}
                                    <div className={styles.warningBox}>
                                        <InfoCircleOutlined className={styles.warningIcon} />
                                        <div className={styles.warningContent}>
                                            <p className={styles.warningTitle}>Lưu ý quan trọng:</p>
                                            <ul className={styles.warningList}>
                                                <li>Chỉ gửi <strong>{selectedCurrency?.symbol}</strong> qua mạng <strong>{selectedNetwork?.name}</strong> đến địa chỉ này.</li>
                                                <li>Gửi bất kỳ loại tiền nào khác có thể dẫn đến mất tài sản vĩnh viễn.</li>
                                                <li>Số tiền nạp tối thiểu là <strong>{selectedNetwork?.minDeposit}</strong>. Nạp ít hơn sẽ không được ghi nhận.</li>
                                                <li>Sau khi gửi, bạn cần chờ <strong>{selectedNetwork?.confirmations} xác nhận</strong> từ mạng lưới.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                )}
            </div>

            <TransactionHistory
                transactions={transactions}
                isLoading={isLoadingHistory}
                filter={historyFilter}
                onFilterChange={(filter) => setHistoryFilter(filter as 'all' | 'deposit')}
                filterOptions={[
                    { value: 'all', label: 'Tất cả' },
                    { value: 'deposit', label: 'Nạp tiền' }
                ]}
            />

            {/* Tron Balance Section */}
            {depositAddress?.network === 'TRC20' && (
                <div className={styles.balanceContainer}>
                    <div className={styles.balanceHeader}>
                        <h3>Số dư ví TRON (On-chain)</h3>
                        <button
                            className={styles.refreshBtn}
                            onClick={checkBalance}
                            disabled={isBalanceLoading}
                        >
                            {isBalanceLoading ? <FaSpinner className={styles.spin} /> : 'Kiểm tra ngay'}
                        </button>
                    </div>

                    {walletBalance && (
                        <div className={styles.balanceInfo}>
                            <div className={styles.balanceItem}>
                                <span className={styles.balanceLabel}>TRX Balance:</span>
                                <span className={styles.balanceValue}>{walletBalance.trx || 0} TRX</span>
                            </div>

                            {/* Display USDT if available in token list */}
                            {walletBalance.tokens && walletBalance.tokens.length > 0 && (
                                <div className={styles.tokensList}>
                                    <h4>Token (TRC20):</h4>
                                    {walletBalance.tokens.map((token: any, index: number) => (
                                        <div key={index} className={styles.balanceItem}>
                                            <span className={styles.balanceLabel}>{token.symbol}:</span>
                                            <span className={styles.balanceValue}>{token.balance}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {!walletBalance && !isBalanceLoading && (
                        <div className={styles.balancePlaceholder}>
                            <p>Nhấn "Kiểm tra ngay" để xem số dư thực tế trên mạng TRON.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
