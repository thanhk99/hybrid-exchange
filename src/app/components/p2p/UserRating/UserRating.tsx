'use client';

import React from 'react';
import { BsFillStarFill } from 'react-icons/bs';
import { formatCompletionRate, formatTradeCount } from '../../../utils/p2pFormatters';
import styles from './UserRating.module.css';

interface UserRatingProps {
  rating: number;
  completedTrades: number;
  username: string;
  className?: string;
}

const UserRating: React.FC<UserRatingProps> = ({ 
  rating, 
  completedTrades, 
  username,
  className = ''
}) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <BsFillStarFill
          key={i}
          className={i < fullStars ? styles.starFilled : styles.starEmpty}
          size={14}
        />
      );
    }
    
    return stars;
  };

  return (
    <div className={`${styles.userRating} ${className}`}>
      <div className={styles.username}>{username}</div>
      <div className={styles.ratingInfo}>
        <div className={styles.stars}>
          {renderStars()}
          <span className={styles.ratingNumber}>{rating.toFixed(1)}</span>
        </div>
        <div className={styles.tradeCount}>
          {formatTradeCount(completedTrades)} giao dịch
        </div>
      </div>
    </div>
  );
};

export default UserRating;