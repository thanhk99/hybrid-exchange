'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftOutlined, DownOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/src/components/common/ProtectedRoute/ProtectedRoute';
// import P2PHeader from '@/src/components/P2P/P2PHeader/P2PHeader';
import OrderTypeSelector from '@/src/components/P2P/OrderForm/OrderTypeSelector';
import CurrencySection from '@/src/components/P2P/OrderForm/CurrencySection';
import PriceAmountSection from '@/src/components/P2P/OrderForm/PriceAmountSection';
import LimitsSection from '@/src/components/P2P/OrderForm/LimitsSection';
import BankAccountSelector from '@/src/components/P2P/OrderForm/BankAccountSelector';
import PaymentMethodSelector from '@/src/components/P2P/OrderForm/PaymentMethodSelector';
import TermsSection from '@/src/components/P2P/OrderForm/TermsSection';
import { OrderType, PaymentMethod } from '@/src/types/p2p';
import P2POrderService from '@/src/services/p2pOrder';
import PaymentMethodService from '@/src/services/paymentMethod';
import { getAssetsOverview } from '@/src/services/balance';
import WalletService from '@/src/services/wallet';
import styles from './page.module.css';

export default function CreateP2POrder() {
    const router = useRouter();
    const [orderType, setOrderType] = useState<OrderType>('sell');
    const [currency, setCurrency] = useState('USDT');
    const [fiatCurrency, setFiatCurrency] = useState('VND');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [minLimit, setMinLimit] = useState('');
    const [maxLimit, setMaxLimit] = useState('');
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedBankAccount, setSelectedBankAccount] = useState<PaymentMethod | null>(null);
    const [selectedPaymentTypes, setSelectedPaymentTypes] = useState<string[]>([]);
    const [terms, setTerms] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableBalance, setAvailableBalance] = useState<number>(0);

    const [currencies, setCurrencies] = useState<string[]>([]);
    const fiatCurrencies = ['VND'];
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [bankAccounts, setBankAccounts] = useState<PaymentMethod[]>([]);

    useEffect(() => {
        const loadCurrencies = async () => {
            try {
                const currenciesData = await WalletService.getCurrencies();
                setCurrencies(currenciesData.map(c => c.symbol));
            } catch (error) {
                console.error("Failed to fetch currencies", error);
                setCurrencies(['USDT', 'BTC', 'ETH', 'BNB']); // Fallback
            }
        };
        loadCurrencies();
    }, []);


    // Load payment methods and bank accounts from API
    useEffect(() => {
        const loadPaymentData = async () => {
            try {
                const methods = await PaymentMethodService.getPaymentMethods();
                console.log('CreatePage - Fetched methods:', methods);
                setPaymentMethods(methods);

                const banks = methods.filter((m: PaymentMethod) => m.type === 'BANK_TRANSFER');
                console.log('CreatePage - Filtered banks:', banks);
                setBankAccounts(banks);
            } catch (error) {
                console.error('Failed to load payment methods:', error);
            }
        };
        loadPaymentData();
    }, []);

    // Load available balance for sell orders
    useEffect(() => {
        const fetchBalance = async () => {
            if (orderType === 'sell') {
                try {
                    const assets = await getAssetsOverview();
                    const fundingAsset = assets.funding.assets.find((a: any) => a.currency === currency);
                    setAvailableBalance(fundingAsset ? fundingAsset.balance : 0);
                } catch (error) {
                    console.error('Failed to fetch balance:', error);
                    setAvailableBalance(0);
                }
            }
        };
        fetchBalance();
    }, [currency, orderType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation for sell orders
        if (orderType === 'sell' && !selectedBankAccount) {
            alert('Vui lòng chọn tài khoản ngân hàng để nhận tiền');
            return;
        }

        if (orderType === 'sell' && bankAccounts.length === 0) {
            alert('Bạn chưa có tài khoản ngân hàng. Vui lòng thêm tài khoản ngân hàng trước.');
            router.push('/p2p/payment-methods');
            return;
        }

        // Validation for buy orders
        if (orderType === 'buy' && selectedPaymentTypes.length === 0) {
            alert('Vui lòng chọn ít nhất một phương thức thanh toán');
            return;
        }

        // Validate amounts
        const priceNum = parseFloat(price);
        const amountNum = parseFloat(amount);
        const minLimitNum = parseFloat(minLimit);
        const maxLimitNum = parseFloat(maxLimit);

        if (minLimitNum > maxLimitNum) {
            alert('Giới hạn tối thiểu không được lớn hơn giới hạn tối đa');
            return;
        }

        if (orderType === 'sell' && amountNum <= 0) {
            alert('Số lượng phải lớn hơn 0');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload: any = {
                type: orderType,
                currency,
                fiatCurrency,
                price: priceNum,
                availableAmount: amountNum,
                minLimit: minLimitNum,
                maxLimit: maxLimitNum,
                terms
            };

            if (orderType === 'sell') {
                // For SELL orders, we need to send the ID of the bank account to receive money
                payload.paymentMethodId = selectedBankAccount?.id;
            } else {
                // For BUY orders, we send the list of accepted payment types
                payload.paymentMethods = selectedPaymentTypes;
            }

            await P2POrderService.createOrder(payload);

            alert('Tạo quảng cáo thành công!');
            router.push('/p2p');
        } catch (error: any) {
            console.error('Failed to create order:', error);

            let errorMsg = 'Tạo quảng cáo thất bại';

            if (error.message.includes('409') || error.message.includes('trùng lập')) {
                errorMsg = 'Quảng cáo này bị trùng lặp. Vui lòng thay đổi giá hoặc phương thức thanh toán.';
            } else if (error.message.includes('không đủ') || error.message.includes('balance')) {
                errorMsg = 'Số dư trong ví Funding của bạn không đủ. Vui lòng nạp thêm tiền.';
            } else if (error.message.includes('không có loại tiền')) {
                errorMsg = `Ví Funding của bạn không có ${currency}. Vui lòng nạp tiền trước.`;
            } else if (error.message.includes('403') || error.message.includes('quyền')) {
                errorMsg = 'Bạn không có quyền tạo quảng cáo. Vui lòng đăng nhập lại hoặc liên hệ hỗ trợ.';
            } else if (error.message) {
                errorMsg = error.message;
            }

            alert(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <h1 className={styles.title}>Tạo quảng cáo P2P</h1>
                        <p className={styles.subtitle}>Đăng quảng cáo mua hoặc bán tiền điện tử</p>
                    </div>
                    <button
                        className={styles.backButton}
                        onClick={() => router.push('/p2p')}
                    >
                        <ArrowLeftOutlined /> Quay lại
                    </button>
                </div>
                <div className={styles.divider}></div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.card}>
                        <OrderTypeSelector value={orderType} onChange={setOrderType} />

                        <CurrencySection
                            currency={currency}
                            fiatCurrency={fiatCurrency}
                            onCurrencyChange={setCurrency}
                            onFiatCurrencyChange={setFiatCurrency}
                            currencies={currencies}
                            fiatCurrencies={fiatCurrencies}
                        />

                        <PriceAmountSection
                            price={price}
                            amount={amount}
                            currency={currency}
                            fiatCurrency={fiatCurrency}
                            onPriceChange={setPrice}
                            onAmountChange={setAmount}
                        />

                        <LimitsSection
                            minLimit={minLimit}
                            maxLimit={maxLimit}
                            fiatCurrency={fiatCurrency}
                            onMinLimitChange={setMinLimit}
                            onMaxLimitChange={setMaxLimit}
                        />

                        {orderType === 'sell' && (
                            <BankAccountSelector
                                bankAccounts={bankAccounts}
                                selectedAccount={selectedBankAccount}
                                onSelect={setSelectedBankAccount}
                                currency={currency}
                            />
                        )}

                        {orderType === 'buy' && (
                            <PaymentMethodSelector
                                selectedTypes={selectedPaymentTypes}
                                onToggle={(type) => {
                                    setSelectedPaymentTypes(prev =>
                                        prev.includes(type)
                                            ? prev.filter(t => t !== type)
                                            : [...prev, type]
                                    );
                                }}
                                currency={currency}
                            />
                        )}

                        <TermsSection value={terms} onChange={setTerms} />

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang tạo...' : 'Tạo quảng cáo'}
                        </button>
                    </div>
                </form>
            </div>
        </ProtectedRoute>
    );
}
