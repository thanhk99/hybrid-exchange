import { ReactNode } from 'react';
import styles from './P2PHeader.module.css';

interface P2PHeaderProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
}

export default function P2PHeader({ title, subtitle, actions }: P2PHeaderProps) {
    return (
        <div className={styles.header}>
            <div className={styles.textContent}>
                <h1 className={styles.title}>{title}</h1>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
            {actions && <div className={styles.actions}>{actions}</div>}
        </div>
    );
}
