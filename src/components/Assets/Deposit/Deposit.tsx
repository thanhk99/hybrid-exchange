"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
    CopyOutlined,
    InfoCircleOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    SearchOutlined,
    DownOutlined
} from "@ant-design/icons";
import { FaSpinner } from "react-icons/fa";
import WalletService, { Currency, Network, DepositAddress, Transaction } from "@/src/services/wallet";
import { Notification } from "../../common/Notification/Notification";
import TransactionHistory from "../../common/TransactionHistory/TransactionHistory";
import styles from "./Deposit.module.css";

export default function Deposit() {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [filteredCurrencies, setFilteredCurrencies] = useState<Currency[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
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
        if (searchTerm) {
            const filtered = currencies.filter(c =>
                c.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCurrencies(filtered);
        } else {
            setFilteredCurrencies(currencies);
        }
    }, [searchTerm, currencies]);

    useEffect(() => {
        if (selectedCurrency && selectedNetwork) {
            fetchDepositAddress(selectedCurrency.id, selectedNetwork.id);
        } else {
            setDepositAddress(null);
        }
    }, [selectedCurrency, selectedNetwork]);

    const fetchCurrencies = async () => {
        setIsLoading(true);
        try {
            const data = await WalletService.getCurrencies();
            setCurrencies(data);
            setFilteredCurrencies(data);
        } catch (error) {
            console.error("Failed to fetch currencies", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDepositAddress = async (currencyId: string, networkId: string) => {
        setIsAddressLoading(true);
        try {
            const address = await WalletService.getDepositAddress(currencyId, networkId);
            setDepositAddress(address);
        } catch (error) {
            console.error("Failed to fetch deposit address", error);
        } finally {
            setIsAddressLoading(false);
        }
    };

    const handleCurrencySelect = (currency: Currency) => {
        setSelectedCurrency(currency);
        setSelectedNetwork(null);
        setDepositAddress(null);
        setSearchTerm("");
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
                <h1 className={styles.title}>Nạp tiền vào ví Funding</h1>
                <p className={styles.subtitle}>Chọn loại tiền và mạng lưới để nhận địa chỉ nạp tiền</p>
            </div>

            <div className={styles.content}>
                {/* Left Column: Currency & Network Selection */}
                <div className={styles.leftSection}>
                    {/* Step 1: Currency Selection */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.stepBadge}>Bước 1</div>
                            <h3 className={styles.sectionTitle}>Chọn loại tiền</h3>
                        </div>

                        {/* Currency Dropdown Button */}
                        <div className={styles.dropdownContainer}>
                            <button
                                className={styles.dropdownButton}
                                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                            >
                                {selectedCurrency ? (
                                    <div className={styles.selectedItem}>
                                        <img src={selectedCurrency.icon} alt={selectedCurrency.symbol} className={styles.selectedIcon} />
                                        <div className={styles.selectedInfo}>
                                            <span className={styles.selectedSymbol}>{selectedCurrency.symbol}</span>
                                            <span className={styles.selectedName}>{selectedCurrency.name}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <span className={styles.placeholder}>Chọn loại tiền...</span>
                                )}
                                <DownOutlined className={`${styles.dropdownIcon} ${isCurrencyDropdownOpen ? styles.rotated : ''}`} />
                            </button>

                            {/* Currency Dropdown List */}
                            {isCurrencyDropdownOpen && (
                                <div className={styles.dropdownMenu}>
                                    {/* Search */}
                                    <div className={styles.searchBox}>
                                        <SearchOutlined className={styles.searchIcon} />
                                        <input
                                            type="text"
                                            className={styles.searchInput}
                                            placeholder="Tìm kiếm tiền..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>

                                    {/* Currency List */}
                                    <div className={styles.currencyList}>
                                        {isLoading ? (
                                            <div className={styles.loading}>
                                                <FaSpinner className={styles.spin} />
                                            </div>
                                        ) : (
                                            filteredCurrencies.map(currency => (
                                                <div
                                                    key={currency.id}
                                                    className={`${styles.currencyItem} ${selectedCurrency?.id === currency.id ? styles.active : ''}`}
                                                    onClick={() => handleCurrencySelect(currency)}
                                                >
                                                    <img src={currency.icon} alt={currency.symbol} className={styles.currencyIcon} />
                                                    <div className={styles.currencyInfo}>
                                                        <span className={styles.currencySymbol}>{currency.symbol}</span>
                                                        <span className={styles.currencyName}>{currency.name}</span>
                                                    </div>
                                                    {selectedCurrency?.id === currency.id && (
                                                        <CheckCircleOutlined className={styles.checkIcon} />
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 2: Network Selection - Only show when currency is selected */}
                    {selectedCurrency && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.stepBadge}>Bước 2</div>
                                <h3 className={styles.sectionTitle}>Chọn mạng lưới nạp tiền</h3>
                            </div>

                            {/* Network Dropdown Button */}
                            <div className={styles.dropdownContainer}>
                                <button
                                    className={styles.dropdownButton}
                                    onClick={() => setIsNetworkDropdownOpen(!isNetworkDropdownOpen)}
                                >
                                    {selectedNetwork ? (
                                        <div className={styles.selectedNetworkItem}>
                                            <span className={styles.selectedNetworkName}>{selectedNetwork.name}</span>
                                            <span className={styles.selectedNetworkDetail}>{selectedNetwork.estimatedTime}</span>
                                        </div>
                                    ) : (
                                        <span className={styles.placeholder}>Chọn mạng lưới...</span>
                                    )}
                                    <DownOutlined className={`${styles.dropdownIcon} ${isNetworkDropdownOpen ? styles.rotated : ''}`} />
                                </button>

                                {/* Network Dropdown List */}
                                {isNetworkDropdownOpen && (
                                    <div className={styles.dropdownMenu}>
                                        <div className={styles.networkList}>
                                            {selectedCurrency.networks.map(network => (
                                                <div
                                                    key={network.id}
                                                    className={`${styles.networkItem} ${selectedNetwork?.id === network.id ? styles.active : ''}`}
                                                    onClick={() => handleNetworkSelect(network)}
                                                >
                                                    <div className={styles.networkHeader}>
                                                        <span className={styles.networkName}>{network.name}</span>
                                                        {selectedNetwork?.id === network.id && (
                                                            <CheckCircleOutlined className={styles.checkIcon} />
                                                        )}
                                                    </div>
                                                    <div className={styles.networkDetails}>
                                                        <div className={styles.networkDetail}>
                                                            <DollarOutlined className={styles.detailIcon} />
                                                            <span>Phí: {network.fee}</span>
                                                        </div>
                                                        <div className={styles.networkDetail}>
                                                            <ClockCircleOutlined className={styles.detailIcon} />
                                                            <span>{network.estimatedTime}</span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.networkMeta}>
                                                        <span className={styles.metaLabel}>Tối thiểu:</span>
                                                        <span className={styles.metaValue}>{network.minDeposit}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Deposit Details - Only show when network is selected */}
                <div className={styles.rightSection}>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.stepBadge}>Bước 3</div>
                            <h3 className={styles.sectionTitle}>Địa chỉ nạp tiền</h3>
                        </div>

                        {!selectedCurrency ? (
                            <div className={styles.emptyState}>
                                <InfoCircleOutlined className={styles.emptyIcon} />
                                <p>Vui lòng chọn loại tiền ở bước 1</p>
                            </div>
                        ) : !selectedNetwork ? (
                            <div className={styles.emptyState}>
                                <InfoCircleOutlined className={styles.emptyIcon} />
                                <p>Vui lòng chọn mạng lưới ở bước 2</p>
                            </div>
                        ) : isAddressLoading ? (
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

                                {/* Network Info */}
                                {selectedNetwork && (
                                    <div className={styles.networkInfoBox}>
                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>Mạng lưới:</span>
                                            <span className={styles.infoValue}>{selectedNetwork.name}</span>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>Số xác nhận:</span>
                                            <span className={styles.infoValue}>{selectedNetwork.confirmations} xác nhận</span>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>Thời gian ước tính:</span>
                                            <span className={styles.infoValue}>{selectedNetwork.estimatedTime}</span>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>Số tiền tối thiểu:</span>
                                            <span className={styles.infoValue}>{selectedNetwork.minDeposit}</span>
                                        </div>
                                    </div>
                                )}

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
        </div>
    );
}
