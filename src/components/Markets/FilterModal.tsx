"use client";

import React, { useState } from 'react';
import styles from './FilterModal.module.css';

export interface FilterOptions {
    priceMin?: number;
    priceMax?: number;
    changeFilter?: 'all' | 'positive' | 'negative';
    marketCapFilter?: 'all' | 'large' | 'medium' | 'small';
}

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: FilterOptions) => void;
    currentFilters: FilterOptions;
}

export default function FilterModal({ isOpen, onClose, onApply, currentFilters }: FilterModalProps) {
    const [priceMin, setPriceMin] = useState<string>(currentFilters.priceMin?.toString() || '');
    const [priceMax, setPriceMax] = useState<string>(currentFilters.priceMax?.toString() || '');
    const [changeFilter, setChangeFilter] = useState<FilterOptions['changeFilter']>(currentFilters.changeFilter || 'all');
    const [marketCapFilter, setMarketCapFilter] = useState<FilterOptions['marketCapFilter']>(currentFilters.marketCapFilter || 'all');

    if (!isOpen) return null;

    const handleReset = () => {
        setPriceMin('');
        setPriceMax('');
        setChangeFilter('all');
        setMarketCapFilter('all');
    };

    const handleApply = () => {
        const filters: FilterOptions = {
            priceMin: priceMin ? parseFloat(priceMin) : undefined,
            priceMax: priceMax ? parseFloat(priceMax) : undefined,
            changeFilter,
            marketCapFilter
        };
        onApply(filters);
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Áp dụng bộ lọc</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.content}>
                    {/* Price Range Filter */}
                    <div className={styles.filterSection}>
                        <label className={styles.label}>Giá</label>
                        <div className={styles.priceRange}>
                            <div className={styles.priceInput}>
                                <input
                                    type="number"
                                    placeholder="Tối thiểu"
                                    value={priceMin}
                                    onChange={(e) => setPriceMin(e.target.value)}
                                    className={styles.input}
                                />
                                <span className={styles.currency}>$</span>
                            </div>
                            <span className={styles.separator}>-</span>
                            <div className={styles.priceInput}>
                                <input
                                    type="number"
                                    placeholder="Tối đa"
                                    value={priceMax}
                                    onChange={(e) => setPriceMax(e.target.value)}
                                    className={styles.input}
                                />
                                <span className={styles.currency}>$</span>
                            </div>
                        </div>
                    </div>

                    {/* Change Filter */}
                    <div className={styles.filterSection}>
                        <label className={styles.label}>Thay đổi</label>
                        <select
                            value={changeFilter}
                            onChange={(e) => setChangeFilter(e.target.value as FilterOptions['changeFilter'])}
                            className={styles.select}
                        >
                            <option value="all">Chọn</option>
                            <option value="positive">Tăng giá</option>
                            <option value="negative">Giảm giá</option>
                        </select>
                    </div>

                    {/* Market Cap Filter */}
                    <div className={styles.filterSection}>
                        <label className={styles.label}>Vốn hóa thị trường</label>
                        <select
                            value={marketCapFilter}
                            onChange={(e) => setMarketCapFilter(e.target.value as FilterOptions['marketCapFilter'])}
                            className={styles.select}
                        >
                            <option value="all">Chọn</option>
                            <option value="large">Lớn (&gt; $10B)</option>
                            <option value="medium">Trung bình ($1B - $10B)</option>
                            <option value="small">Nhỏ (&lt; $1B)</option>
                        </select>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.resetBtn} onClick={handleReset}>
                        Đặt lại
                    </button>
                    <button className={styles.applyBtn} onClick={handleApply}>
                        Áp dụng
                    </button>
                </div>
            </div>
        </div>
    );
}
