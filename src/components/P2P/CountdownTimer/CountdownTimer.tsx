import { useState, useEffect } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import styles from './CountdownTimer.module.css';

interface CountdownTimerProps {
    expiresAt: string;
    onExpire?: () => void;
}

export default function CountdownTimer({ expiresAt, onExpire }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState('');
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const expiry = new Date(expiresAt).getTime();
            const diff = expiry - now;

            if (diff <= 0) {
                setIsExpired(true);
                setTimeLeft('Đã hết hạn');
                if (onExpire) onExpire();
                return;
            }

            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, onExpire]);

    return (
        <div className={`${styles.timer} ${isExpired ? styles.expired : ''}`}>
            <ClockCircleOutlined className={styles.icon} />
            <span className={styles.time}>{timeLeft}</span>
        </div>
    );
}
