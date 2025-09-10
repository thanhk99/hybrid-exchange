'use client';

import React, { useState } from 'react';
import { BsFillArrowUpRightSquareFill, BsFillArrowDownLeftCircleFill } from 'react-icons/bs';
import styles from './TradingForm.module.css';

interface TradingFormProps {
  onTradeTypeChange: (type: 'buy' | 'sell') => void;
  activeTradeType: 'buy' | 'sell';
}

const TradingForm: React.FC<TradingFormProps> = ({ onTradeTypeChange, activeTradeType }) => {
  const [fiatCurrency, setFiatCurrency] = useState('VND');
  const [cryptoCurrency, setCryptoCurrency] = useState('USDT');
  const [amount, setAmount] = useState('');
  const [referencePrice] = useState('1 USDT ≈ 23,888 VND');

  return (
    <div className={styles.tradingFormContainer}>
      {/* Trade Type Tabs */}
      <div className={styles.tradeTypeTabs}>
        <button 
          className={`${styles.tradeTab} ${activeTradeType === 'buy' ? styles.tradeTabActive : ''}`}
          onClick={() => onTradeTypeChange('buy')}
        >
          <BsFillArrowUpRightSquareFill size={16} />
          Mua
        </button>
        <button 
          className={`${styles.tradeTab} ${activeTradeType === 'sell' ? styles.tradeTabActive : ''}`}
          onClick={() => onTradeTypeChange('sell')}
        >
          <BsFillArrowDownLeftCircleFill size={16} />
          Bán
        </button>
      </div>

      {/* Currency Selection */}
      <div className={styles.currencySection}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Bạn thanh toán</label>
          <div className={styles.currencySelector}>
            <div className={styles.currencyFlag}>🇻🇳</div>
            <select 
              className={styles.currencySelect}
              value={fiatCurrency}
              onChange={(e) => setFiatCurrency(e.target.value)}
            >
              <option value="VND">VND</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div className={styles.amountRange}>
          <span className={styles.rangeText}>130,000 - 2,600,000,000 VND</span>
        </div>
      </div>

      {/* Crypto Selection */}
      <div className={styles.currencySection}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Bạn nhận</label>
          <div className={styles.currencySelector}>
            <div className={styles.cryptoIcon}>₮</div>
            <select 
              className={styles.currencySelect}
              value={cryptoCurrency}
              onChange={(e) => setCryptoCurrency(e.target.value)}
            >
              <option value="USDT">USDT</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </select>
          </div>
        </div>

        <div className={styles.amountInput}>
          <input
            type="number"
            className={styles.amountField}
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      {/* Reference Price */}
      <div className={styles.referencePrice}>
        <span className={styles.priceLabel}>Giá tham chiếu</span>
        <span className={styles.priceValue}>{referencePrice}</span>
      </div>

      {/* Payment Method Selection */}
      <div className={styles.paymentSection}>
        <label className={styles.formLabel}>Chọn phương thức thanh toán</label>
        <div className={styles.paymentMethods}>
          <button className={styles.paymentMethod}>
            Tất cả phương thức thanh toán
          </button>
        </div>
      </div>

      {/* Action Button */}
      <button className={`${styles.actionButton} ${activeTradeType === 'buy' ? styles.buyButton : styles.sellButton}`}>
        {activeTradeType === 'buy' ? 'Tìm người bán' : 'Tìm người mua'}
      </button>
    </div>
  );
};

export default TradingForm;