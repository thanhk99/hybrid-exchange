'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsFillBasket3Fill, BsFillArrowDownSquareFill } from 'react-icons/bs';
import { setFilters } from '../../../store/p2pSlice';
import { P2PFilters } from '../../../types/p2p';
import { RootState } from '../../../store/store';
import styles from './P2PFilters.module.css';

const P2PFilters: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.p2p.filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof P2PFilters, value: any) => {
    dispatch(setFilters({ [key]: value }));
  };

  const cryptocurrencies = ['USDT', 'BTC', 'ETH', 'BNB'];
  const fiatCurrencies = ['VND', 'USD'];
  const paymentMethodOptions = [
    { id: 'bank', name: 'Ngân hàng' },
    { id: 'momo', name: 'MoMo' },
    { id: 'zalopay', name: 'ZaloPay' },
    { id: 'viettelpay', name: 'ViettelPay' }
  ];

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.mainFilters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Tiền mã hóa</label>
          <select 
            className={styles.filterSelect}
            value={filters.cryptocurrency}
            onChange={(e) => handleFilterChange('cryptocurrency', e.target.value)}
          >
            {cryptocurrencies.map(crypto => (
              <option key={crypto} value={crypto}>{crypto}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Tiền tệ</label>
          <select 
            className={styles.filterSelect}
            value={filters.fiatCurrency}
            onChange={(e) => handleFilterChange('fiatCurrency', e.target.value)}
          >
            {fiatCurrencies.map(fiat => (
              <option key={fiat} value={fiat}>{fiat}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Sắp xếp theo</label>
          <select 
            className={styles.filterSelect}
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="price">Giá</option>
            <option value="completion_rate">Tỷ lệ hoàn thành</option>
            <option value="trades_count">Số giao dịch</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <button 
            className={styles.advancedToggle}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <BsFillBasket3Fill size={16} />
            Bộ lọc
            <BsFillArrowDownSquareFill 
              size={12} 
              className={showAdvanced ? styles.rotated : ''}
            />
          </button>
        </div>
      </div>

      {showAdvanced && (
        <div className={styles.advancedFilters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Phương thức thanh toán</label>
            <div className={styles.paymentMethods}>
              {paymentMethodOptions.map(method => (
                <label key={method.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.paymentMethods.includes(method.id)}
                    onChange={(e) => {
                      const newMethods = e.target.checked
                        ? [...filters.paymentMethods, method.id]
                        : filters.paymentMethods.filter(id => id !== method.id);
                      handleFilterChange('paymentMethods', newMethods);
                    }}
                  />
                  {method.name}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filters.onlineOnly}
                onChange={(e) => handleFilterChange('onlineOnly', e.target.checked)}
              />
              Chỉ người dùng online
            </label>
          </div>

          <div className={styles.amountFilters}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Số lượng tối thiểu</label>
              <input
                type="number"
                className={styles.filterInput}
                placeholder="0"
                value={filters.minAmount || ''}
                onChange={(e) => handleFilterChange('minAmount', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Số lượng tối đa</label>
              <input
                type="number"
                className={styles.filterInput}
                placeholder="Không giới hạn"
                value={filters.maxAmount || ''}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default P2PFilters;