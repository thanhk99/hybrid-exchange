"use client";

import React, { useState } from 'react';
import { FuturesCoin } from '@/src/types/futures';
import FuturesService from '@/src/services/futures';
import styles from './TradingModal.module.css';

interface TradingModalProps {
    isOpen: boolean;
    onClose: () => void;
    coin: FuturesCoin;
}

export default function TradingModal({ isOpen, onClose, coin }: TradingModalProps) {
    const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
    const [positionSide, setPositionSide] = useState<'LONG' | 'SHORT'>('LONG');
    const [orderType, setOrderType] = useState<'LIMIT' | 'MARKET'>('LIMIT');
    const [price, setPrice] = useState(coin.markPrice.toString());
    const [quantity, setQuantity] = useState('');
    const [leverage, setLeverage] = useState(10);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!quantity || (orderType === 'LIMIT' && !price)) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await FuturesService.placeFuturesOrder({
                symbol: coin.symbol,
                side,
                positionSide,
                type: orderType,
                price: orderType === 'LIMIT' ? parseFloat(price) : undefined,
                quantity: parseFloat(quantity),
                leverage,
            });
            alert('Order placed successfully!');
            onClose();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to place order');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClosePosition = async () => {
        if (!confirm(`Close all ${coin.symbol} positions?`)) return;

        setIsSubmitting(true);
        try {
            await FuturesService.closePosition({ symbol: coin.symbol });
            alert('Position closed successfully!');
            onClose();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to close position');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAdjustLeverage = async () => {
        setIsSubmitting(true);
        try {
            await FuturesService.adjustLeverage({ symbol: coin.symbol, leverage });
            alert(`Leverage adjusted to ${leverage}x`);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to adjust leverage');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{coin.symbol}</h3>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.body}>
                    {/* Side Selection */}
                    <div className={styles.section}>
                        <label className={styles.label}>Side</label>
                        <div className={styles.toggleGroup}>
                            <button
                                className={`${styles.toggleBtn} ${styles.buy} ${side === 'BUY' ? styles.active : ''}`}
                                onClick={() => setSide('BUY')}
                            >
                                Buy
                            </button>
                            <button
                                className={`${styles.toggleBtn} ${styles.sell} ${side === 'SELL' ? styles.active : ''}`}
                                onClick={() => setSide('SELL')}
                            >
                                Sell
                            </button>
                        </div>
                    </div>

                    {/* Position Side */}
                    <div className={styles.section}>
                        <label className={styles.label}>Position</label>
                        <div className={styles.toggleGroup}>
                            <button
                                className={`${styles.toggleBtn} ${positionSide === 'LONG' ? styles.active : ''}`}
                                onClick={() => setPositionSide('LONG')}
                            >
                                Long
                            </button>
                            <button
                                className={`${styles.toggleBtn} ${positionSide === 'SHORT' ? styles.active : ''}`}
                                onClick={() => setPositionSide('SHORT')}
                            >
                                Short
                            </button>
                        </div>
                    </div>

                    {/* Order Type */}
                    <div className={styles.section}>
                        <label className={styles.label}>Order Type</label>
                        <div className={styles.toggleGroup}>
                            <button
                                className={`${styles.toggleBtn} ${orderType === 'LIMIT' ? styles.active : ''}`}
                                onClick={() => setOrderType('LIMIT')}
                            >
                                Limit
                            </button>
                            <button
                                className={`${styles.toggleBtn} ${orderType === 'MARKET' ? styles.active : ''}`}
                                onClick={() => setOrderType('MARKET')}
                            >
                                Market
                            </button>
                        </div>
                    </div>

                    {/* Price (for Limit orders) */}
                    {orderType === 'LIMIT' && (
                        <div className={styles.section}>
                            <label className={styles.label}>Price (USDT)</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                step="0.01"
                            />
                        </div>
                    )}

                    {/* Quantity */}
                    <div className={styles.section}>
                        <label className={styles.label}>Quantity</label>
                        <input
                            type="number"
                            className={styles.input}
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                            placeholder="0.00"
                            step="0.001"
                        />
                    </div>

                    {/* Leverage */}
                    <div className={styles.leverageSection}>
                        <div className={styles.leverageDisplay}>
                            <label className={styles.label}>Leverage</label>
                            <span className={styles.leverageValue}>{leverage}x</span>
                        </div>
                        <input
                            type="range"
                            className={styles.slider}
                            min="1"
                            max="125"
                            value={leverage}
                            onChange={e => setLeverage(parseInt(e.target.value))}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                            <span>1x</span>
                            <span>125x</span>
                        </div>
                        <button
                            onClick={handleAdjustLeverage}
                            disabled={isSubmitting}
                            style={{
                                marginTop: '8px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                border: '1px solid #e0e0e0',
                                background: '#fff',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Apply Leverage
                        </button>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={handleClosePosition} disabled={isSubmitting}>
                        Close Position
                    </button>
                    <button
                        className={`${styles.submitBtn} ${side === 'BUY' ? styles.buy : styles.sell}`}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : `${side} ${positionSide}`}
                    </button>
                </div>
            </div>
        </div>
    );
}
