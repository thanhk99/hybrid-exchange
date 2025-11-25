import React from 'react';
import styles from './SettingRow.module.css';

interface SettingRowProps {
    label: string;
    description?: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

export default function SettingRow({ label, description, value, onChange }: SettingRowProps) {
    return (
        <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
                <div className={styles.settingLabel}>{label}</div>
                {description && <div className={styles.settingDescription}>{description}</div>}
            </div>
            <label className={styles.switch}>
                <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span className={styles.slider}></span>
            </label>
        </div>
    );
}
