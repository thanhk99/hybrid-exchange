import CurrencySelector from '../CurrencySelector/CurrencySelector';
import styles from './CurrencySection.module.css';

interface CurrencySectionProps {
    currency: string;
    fiatCurrency: string;
    onCurrencyChange: (currency: string) => void;
    onFiatCurrencyChange: (currency: string) => void;
    currencies: string[];
    fiatCurrencies: string[];
}

export default function CurrencySection({
    currency,
    fiatCurrency,
    onCurrencyChange,
    onFiatCurrencyChange,
    currencies,
    fiatCurrencies
}: CurrencySectionProps) {
    return (
        <div className={styles.container}>
            <label className={styles.label}>Tiền điện tử</label>
            <div className={styles.row}>
                <CurrencySelector
                    value={currency}
                    onChange={onCurrencyChange}
                    currencies={currencies}
                    label="Tiền điện tử"
                />
                <CurrencySelector
                    value={fiatCurrency}
                    onChange={onFiatCurrencyChange}
                    currencies={fiatCurrencies}
                    label="Tiền tệ"
                />
            </div>
        </div>
    );
}
