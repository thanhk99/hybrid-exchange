'use client';

import React from 'react';
import { BsFillCreditCardFill, BsFillBuildingFillUp } from 'react-icons/bs';
import { PaymentMethod } from '../../../types/p2p';
import styles from './PaymentMethods.module.css';

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  className?: string;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  paymentMethods, 
  className = '' 
}) => {
  const getPaymentIcon = (iconType: string) => {
    switch (iconType) {
      case 'bank':
        return <BsFillCreditCardFill size={14} />;
      case 'momo':
      case 'zalopay':
      case 'viettelpay':
        return <BsFillBuildingFillUp size={14} />;
      default:
        return <BsFillCreditCardFill size={14} />;
    }
  };

  return (
    <div className={`${styles.paymentMethods} ${className}`}>
      {paymentMethods.map((method) => (
        <div key={method.id} className={styles.paymentChip}>
          <div className={styles.paymentIcon}>
            {getPaymentIcon(method.icon)}
          </div>
          <span className={styles.paymentName}>{method.name}</span>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethods;