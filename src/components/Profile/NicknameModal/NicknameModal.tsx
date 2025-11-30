import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './NicknameModal.module.css';

interface NicknameModalProps {
    isOpen: boolean;
    nickname: string;
    onClose: () => void;
    onSave: (nickname: string) => void;
    loading?: boolean;
    error?: string;
    success?: string;
}

export default function NicknameModal({ isOpen, nickname, onClose, onSave, loading = false, error = '', success = '' }: NicknameModalProps) {
    const [tempNickname, setTempNickname] = React.useState(nickname);

    React.useEffect(() => {
        setTempNickname(nickname);
    }, [nickname, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (tempNickname.trim().length < 2) {
            return;
        }
        onSave(tempNickname);
    };

    return (
        <>
            <div className={styles.modalOverlay} onClick={onClose} />
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3>Biệt danh</h3>
                    <button className={styles.closeButton} onClick={onClose}>
                        <CloseOutlined />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <p className={styles.modalDescription}>
                        Biệt danh của bạn được dùng để giao dịch và nhận tin trong ứng dụng
                    </p>
                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className={styles.successMessage}>
                            {success}
                        </div>
                    )}
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            className={styles.modalInput}
                            value={tempNickname}
                            onChange={(e) => setTempNickname(e.target.value.slice(0, 20))}
                            maxLength={20}
                            placeholder="Nhập biệt danh"
                            disabled={loading}
                        />
                        {tempNickname && (
                            <button
                                className={styles.clearButton}
                                onClick={() => setTempNickname('')}
                                disabled={loading}
                            >
                                <CloseOutlined />
                            </button>
                        )}
                    </div>
                    <p className={styles.charCount}>
                        Biệt danh của bạn còn 9 lần chỉnh sửa trong năm nay {tempNickname.length} / 20
                    </p>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={onClose} disabled={loading}>
                        Hủy
                    </button>
                    <button
                        className={styles.confirmButton}
                        onClick={handleSave}
                        disabled={loading || tempNickname.trim().length < 2}
                    >
                        {loading ? 'Đang lưu...' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </>
    );
}
