'use client';

import { useState, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { P2POrder } from '@/src/types/p2p';
import styles from './EditAdModal.module.css';

interface EditAdModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: EditAdData) => Promise<void>;
    ad: P2POrder | null;
}

export interface EditAdData {
    price?: number;
    minAmount?: number;
    maxAmount?: number;
    availableAmount?: number;
    isActive?: boolean;
    termsConditions?: string;
}

export const EditAdModal: React.FC<EditAdModalProps> = ({
    isOpen,
    onClose,
    onSave,
    ad,
}) => {
    const [formData, setFormData] = useState<EditAdData>({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (ad) {
            setFormData({
                price: ad.price,
                minAmount: ad.minLimit,
                maxAmount: ad.maxLimit,
                availableAmount: ad.availableAmount,
                isActive: ad.status === 'active',
                termsConditions: ad.terms,
            });
            setErrors({});
        }
    }, [ad]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (formData.price !== undefined && formData.price <= 0) {
            newErrors.price = 'Giá phải lớn hơn 0';
        }

        if (formData.minAmount !== undefined && formData.minAmount <= 0) {
            newErrors.minAmount = 'Số tiền tối thiểu phải lớn hơn 0';
        }

        if (formData.maxAmount !== undefined && formData.maxAmount <= 0) {
            newErrors.maxAmount = 'Số tiền tối đa phải lớn hơn 0';
        }

        if (
            formData.minAmount !== undefined &&
            formData.maxAmount !== undefined &&
            formData.minAmount > formData.maxAmount
        ) {
            newErrors.minAmount = 'Số tiền tối thiểu không được lớn hơn số tiền tối đa';
        }

        if (formData.availableAmount !== undefined && formData.availableAmount < 0) {
            newErrors.availableAmount = 'Số lượng khả dụng không được âm';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Failed to save ad:', error);
            setErrors({ submit: 'Không thể lưu thay đổi. Vui lòng thử lại.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof EditAdData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    if (!isOpen || !ad) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Chỉnh sửa quảng cáo</h3>
                    <button className={styles.closeButton} onClick={onClose}>
                        <CloseOutlined />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.content}>
                        <div className={styles.adInfo}>
                            <span className={`${styles.typeBadge} ${ad.type === 'buy' ? styles.typeBuy : styles.typeSell}`}>
                                {ad.type === 'buy' ? 'MUA' : 'BÁN'}
                            </span>
                            <span className={styles.currency}>{ad.currency}</span>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Đơn giá ({ad.fiatCurrency})
                            </label>
                            <input
                                type="number"
                                className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                                value={formData.price || ''}
                                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                                step="0.01"
                            />
                            {errors.price && <span className={styles.error}>{errors.price}</span>}
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Số tiền tối thiểu ({ad.fiatCurrency})
                                </label>
                                <input
                                    type="number"
                                    className={`${styles.input} ${errors.minAmount ? styles.inputError : ''}`}
                                    value={formData.minAmount || ''}
                                    onChange={(e) => handleChange('minAmount', parseFloat(e.target.value))}
                                    step="0.01"
                                />
                                {errors.minAmount && <span className={styles.error}>{errors.minAmount}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Số tiền tối đa ({ad.fiatCurrency})
                                </label>
                                <input
                                    type="number"
                                    className={`${styles.input} ${errors.maxAmount ? styles.inputError : ''}`}
                                    value={formData.maxAmount || ''}
                                    onChange={(e) => handleChange('maxAmount', parseFloat(e.target.value))}
                                    step="0.01"
                                />
                                {errors.maxAmount && <span className={styles.error}>{errors.maxAmount}</span>}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Số lượng khả dụng ({ad.currency})
                            </label>
                            <input
                                type="number"
                                className={`${styles.input} ${errors.availableAmount ? styles.inputError : ''}`}
                                value={formData.availableAmount || ''}
                                onChange={(e) => handleChange('availableAmount', parseFloat(e.target.value))}
                                step="0.01"
                            />
                            {errors.availableAmount && <span className={styles.error}>{errors.availableAmount}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Điều khoản</label>
                            <textarea
                                className={styles.textarea}
                                value={formData.termsConditions || ''}
                                onChange={(e) => handleChange('termsConditions', e.target.value)}
                                rows={4}
                                placeholder="Nhập điều khoản giao dịch..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.toggleLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={formData.isActive || false}
                                    onChange={(e) => handleChange('isActive', e.target.checked)}
                                />
                                <span>Kích hoạt quảng cáo</span>
                            </label>
                        </div>

                        {errors.submit && (
                            <div className={styles.submitError}>{errors.submit}</div>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={`${styles.button} ${styles.cancelButton}`}
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className={`${styles.button} ${styles.saveButton}`}
                            disabled={loading}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
