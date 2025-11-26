import styles from './TermsSection.module.css';

interface TermsSectionProps {
    value: string;
    onChange: (value: string) => void;
}

export default function TermsSection({ value, onChange }: TermsSectionProps) {
    return (
        <div className={styles.container}>
            <label className={styles.label}>Điều khoản (Tùy chọn)</label>
            <textarea
                className={styles.textarea}
                placeholder="Nhập điều khoản giao dịch của bạn..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={4}
            />
        </div>
    );
}
