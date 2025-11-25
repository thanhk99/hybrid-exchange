import { StarFilled } from '@ant-design/icons';
import styles from './UserRating.module.css';

interface UserRatingProps {
    rating: number;
    completedTrades: number;
    completionRate: number;
    size?: 'small' | 'medium' | 'large';
}

export default function UserRating({ rating, completedTrades, completionRate, size = 'medium' }: UserRatingProps) {
    return (
        <div className={`${styles.rating} ${styles[size]}`}>
            <div className={styles.stars}>
                <StarFilled className={styles.star} />
                <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
            </div>
            <div className={styles.stats}>
                <span className={styles.trades}>{completedTrades} giao dịch</span>
                <span className={styles.separator}>•</span>
                <span className={styles.completion}>{completionRate.toFixed(1)}%</span>
            </div>
        </div>
    );
}
