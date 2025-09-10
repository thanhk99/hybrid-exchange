'use client';

import React from 'react';
import { P2POrder } from '../../../types/p2p';
import { formatPrice, formatAmount } from '../../../utils/p2pFormatters';
import UserRating from '../UserRating/UserRating';
import PaymentMethods from '../PaymentMethods/PaymentMethods';
import styles from './OrderCard.module.css';

interface OrderCardProps {
  order: P2POrder;
  tradeType: 'buy' | 'sell';
  onTradeClick: (order: P2POrder) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, tradeType, onTradeClick }) => {
  const handleTradeClick = () => {
    onTradeClick(order);
  };

  return (
    <div className={styles.orderCard}>
      <div className={styles.cardContent}>
        <div className={styles.traderInfo}>
          <UserRating 
            rating={order.userRating}
            completedTrades={order.completedTrades}
            username={order.username}
          />
        </div>

        <div className={styles.priceInfo}>
          <div className={styles.price}>
            {formatPrice(order.price, order.fiatCurrency)}
          </div>
          <div className={styles.available}>
            Có sẵn: {formatAmount(order.availableAmount, order.cryptocurrency)}
          </div>
        </div>

        <div className={styles.limitInfo}>
          <div className={styles.limits}>
            {formatPrice(order.minAmount, order.fiatCurrency)} - {formatPrice(order.maxAmount, order.fiatCurrency)}
          </div>
        </div>

        <div className={styles.paymentInfo}>
          <PaymentMethods paymentMethods={order.paymentMethods} />
        </div>

        <div className={styles.actionInfo}>
          <button 
            className={`${styles.tradeButton} ${tradeType === 'buy' ? styles.buyButton : styles.sellButton}`}
            onClick={handleTradeClick}
          >
            {tradeType === 'buy' ? 'Mua' : 'Bán'} {order.cryptocurrency}
          </button>
        </div>
      </div>

      {order.terms && (
        <div className={styles.terms}>
          <span className={styles.termsLabel}>Điều khoản:</span>
          <span className={styles.termsText}>{order.terms}</span>
        </div>
      )}
    </div>
  );
};

export default OrderCard;