'use client';

import React, { useState } from 'react';
import { P2POrder, PaymentMethod } from '../../../types/p2p';
import { formatPrice, formatAmount } from '../../../utils/p2pFormatters';
import UserRating from '../UserRating/UserRating';
import styles from './TradeModal.module.css';

interface TradeModalProps {
  selectedOrder: P2POrder | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmTrade: (amount: number, paymentMethodId: string) => void;
}

const TradeModal: React.FC<TradeModalProps> = ({
  selectedOrder,
  isOpen,
  onClose,
  onConfirmTrade
}) => {
  const [amount, setAmount] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [errors, setErrors] = useState<{ amount?: string; paymentMethod?: string }>({});

  if (!isOpen || !selectedOrder) return null;

  const validateForm = () => {
    const newErrors: { amount?: string; paymentMethod?: string } = {};
    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount)) {
      newErrors.amount = 'Vui lòng nhập số lượng';
    } else if (numAmount < selectedOrder.minAmount) {
      newErrors.amount = `Số lượng tối thiểu: ${formatPrice(selectedOrder.minAmount, selectedOrder.fiatCurrency)}`;
    } else if (numAmount > selectedOrder.maxAmount) {
      newErrors.amount = `Số lượng tối đa: ${formatPrice(selectedOrder.maxAmount, selectedOrder.fiatCurrency)}`;
    }

    if (!selectedPaymentMethod) {
      newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      onConfirmTrade(parseFloat(amount), selectedPaymentMethod);
      setAmount('');
      setSelectedPaymentMethod('');
      setErrors({});
    }
  };

  const handleClose = () => {
    setAmount('');
    setSelectedPaymentMethod('');
    setErrors({});
    onClose();
  };

  const totalFiat = parseFloat(amount) * selectedOrder.price;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Xác nhận giao dịch</h3>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.orderInfo}>
            <div className={styles.traderSection}>
              <UserRating
                rating={selectedOrder.userRating}
                completedTrades={selectedOrder.completedTrades}
                username={selectedOrder.username}
              />
            </div>

            <div className={styles.priceSection}>
              <div className={styles.priceLabel}>Giá</div>
              <div className={styles.priceValue}>
                {formatPrice(selectedOrder.price, selectedOrder.fiatCurrency)}
              </div>
            </div>

            <div className={styles.limitSection}>
              <div className={styles.limitLabel}>Giới hạn</div>
              <div className={styles.limitValue}>
                {formatPrice(selectedOrder.minAmount, selectedOrder.fiatCurrency)} - {formatPrice(selectedOrder.maxAmount, selectedOrder.fiatCurrency)}
              </div>
            </div>
          </div>

          <div className={styles.tradeForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Số lượng {selectedOrder.fiatCurrency}
              </label>
              <input
                type="number"
                className={`${styles.formInput} ${errors.amount ? styles.inputError : ''}`}
                placeholder={`${selectedOrder.minAmount} - ${selectedOrder.maxAmount}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {errors.amount && (
                <span className={styles.errorText}>{errors.amount}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Phương thức thanh toán</label>
              <select
                className={`${styles.formSelect} ${errors.paymentMethod ? styles.inputError : ''}`}
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              >
                <option value="">Chọn phương thức thanh toán</option>
                {selectedOrder.paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name} ({method.processingTime})
                  </option>
                ))}
              </select>
              {errors.paymentMethod && (
                <span className={styles.errorText}>{errors.paymentMethod}</span>
              )}
            </div>

            {amount && !isNaN(parseFloat(amount)) && (
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>Số lượng {selectedOrder.cryptocurrency}:</span>
                  <span>{formatAmount(parseFloat(amount) / selectedOrder.price, selectedOrder.cryptocurrency)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Tổng tiền:</span>
                  <span className={styles.totalAmount}>
                    {formatPrice(totalFiat, selectedOrder.fiatCurrency)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={handleClose}>
            Hủy
          </button>
          <button 
            className={styles.confirmButton}
            onClick={handleConfirm}
          >
            Xác nhận giao dịch
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;