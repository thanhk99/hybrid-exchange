import { PaymentMethod } from '@/src/types/p2p';
import { useRouter } from 'next/navigation';
import styles from './BankAccountSelector.module.css';

interface BankAccountSelectorProps {
    bankAccounts: PaymentMethod[];
    selectedAccount: PaymentMethod | null;
    onSelect: (account: PaymentMethod) => void;
    currency: string;
}

export default function BankAccountSelector({
    bankAccounts,
    selectedAccount,
    onSelect,
    currency
}: BankAccountSelectorProps) {
    const router = useRouter();

    if (bankAccounts.length === 0) {
        return (
            <div className={styles.container}>
                <label className={styles.label}>
                    Tài khoản ngân hàng nhận tiền
                    <span className={styles.required}>*</span>
                </label>
                <div className={styles.noMethods}>
                    <p>Bạn chưa có tài khoản ngân hàng nào.</p>
                    <button
                        type="button"
                        className={styles.addButton}
                        onClick={() => router.push('/p2p/payment-methods')}
                    >
                        Thêm tài khoản ngân hàng
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <label className={styles.label}>
                Tài khoản ngân hàng nhận tiền
                <span className={styles.required}>*</span>
            </label>
            <div className={styles.grid}>
                {bankAccounts.map(account => (
                    <label
                        key={account.id}
                        className={`${styles.option} ${selectedAccount?.id === account.id ? styles.active : ''}`}
                    >
                        <input
                            type="radio"
                            name="bankAccount"
                            checked={selectedAccount?.id === account.id}
                            onChange={() => onSelect(account)}
                            className={styles.radio}
                        />
                        <div className={styles.details}>
                            <div className={styles.name}>{account.accountName}</div>
                            <div className={styles.number}>{account.accountNumber}</div>
                            {account.bankName && (
                                <div className={styles.bank}>{account.bankName}</div>
                            )}
                        </div>
                    </label>
                ))}
            </div>
            <div className={styles.hint}>
                Chọn tài khoản ngân hàng mà bạn muốn nhận tiền khi bán {currency}
            </div>
        </div>
    );
}
