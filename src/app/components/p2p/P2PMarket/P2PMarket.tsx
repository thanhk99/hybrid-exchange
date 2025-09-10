'use client';

import React from 'react';
import { P2POrder } from '../../../types/p2p';
import OrderCard from '../OrderCard/OrderCard';
import styles from './P2PMarket.module.css';

interface P2PMarketProps {
  orders: P2POrder[];
  loading: boolean;
  tradeType: 'buy' | 'sell';
  onTradeClick: (order: P2POrder) => void;
}

const P2PMarket: React.FC<P2PMarketProps> = ({ 
  orders, 
  loading, 
  tradeType, 
  onTradeClick 
}) => {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <span>Đang tải...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyState}>
          <h3>Không có đơn hàng nào</h3>
          <p>Hiện tại không có đơn hàng phù hợp với bộ lọc của bạn</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.marketContainer}>
      <div className={styles.marketHeader}>
        <div className={styles.headerRow}>
          <div className={styles.colTrader}>Người giao dịch</div>
          <div className={styles.colPrice}>Giá</div>
          <div className={styles.colLimit}>Giới hạn</div>
          <div className={styles.colPayment}>Thanh toán</div>
          <div className={styles.colAction}>Thao tác</div>
        </div>
      </div>
      
      <div className={styles.marketBody}>
        {orders.map((order) => (
          <OrderCard 
            key={order.id} 
            order={order} 
            tradeType={tradeType}
            onTradeClick={onTradeClick}
          />
        ))}
      </div>
    </div>
  );
};

export default P2PMarket;