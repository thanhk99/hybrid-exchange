'use client';

import { CloseOutlined } from '@ant-design/icons';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    content: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    content,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    isDanger = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <button className={styles.closeButton} onClick={onClose}>
                        <CloseOutlined />
                    </button>
                </div>

                <div className={styles.content}>
                    {content}
                </div>

                <div className={styles.actions}>
                    <button
                        className={`${styles.button} ${styles.cancelButton}`}
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`${styles.button} ${styles.confirmButton} ${isDanger ? styles.danger : ''}`}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
