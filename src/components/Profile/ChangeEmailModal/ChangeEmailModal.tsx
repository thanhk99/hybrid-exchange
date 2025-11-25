import React, { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styles from './ChangeEmailModal.module.css';

interface ChangeEmailModalProps {
    isOpen: boolean;
    currentEmail: string;
    onClose: () => void;
    onSave: (email: string) => void;
}

export default function ChangeEmailModal({ isOpen, currentEmail, onClose, onSave }: ChangeEmailModalProps) {
    const [step, setStep] = useState(1);
    const [newEmail, setNewEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(0);

    React.useEffect(() => {
        if (isOpen) {
            setStep(1);
            setNewEmail('');
            setVerificationCode(['', '', '', '', '', '']);
            setCountdown(0);
        }
    }, [isOpen]);

    React.useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    if (!isOpen) return null;

    const handleSendCode = () => {
        if (newEmail && newEmail !== currentEmail) {
            setStep(2);
            setCountdown(60);
            // TODO: Call API to send verification code
        }
    };

    const handleCodeChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newCode = [...verificationCode];
            newCode[index] = value;
            setVerificationCode(newCode);

            // Auto focus next input
            if (value && index < 5) {
                const nextInput = document.getElementById(`code-${index + 1}`);
                nextInput?.focus();
            }
        }
    };

    const handleResendCode = () => {
        setCountdown(60);
        // TODO: Call API to resend code
    };

    const handleVerify = () => {
        const code = verificationCode.join('');
        if (code.length === 6) {
            // TODO: Call API to verify code
            onSave(newEmail);
        }
    };

    return (
        <>
            <div className={styles.modalOverlay} onClick={onClose} />
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3>Thay đổi email</h3>
                    <button className={styles.closeButton} onClick={onClose}>
                        <CloseOutlined />
                    </button>
                </div>

                {step === 1 ? (
                    <div className={styles.modalBody}>
                        <div className={styles.stepIndicator}>1 / 2</div>
                        <h4 className={styles.stepTitle}>Địa chỉ email mới</h4>
                        <div className={styles.formGroup}>
                            <label>Địa chỉ email mới</label>
                            <input
                                type="email"
                                className={styles.input}
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="Nhập"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Mã xác minh email</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Nhập"
                                disabled
                            />
                        </div>
                        <button
                            className={styles.primaryButton}
                            onClick={handleSendCode}
                            disabled={!newEmail || newEmail === currentEmail}
                        >
                            Xác nhận
                        </button>
                    </div>
                ) : (
                    <div className={styles.modalBody}>
                        <div className={styles.stepIndicator}>1 / 2</div>
                        <h4 className={styles.stepTitle}>Xác minh bằng email</h4>
                        <p className={styles.description}>
                            Chúng tôi đã gửi mã gồm 6 chữ số đến nhận***0604@gm***com.
                            Mã này có hiệu lực trong 10 phút và có thể nhầm trong mục thư rác.
                        </p>
                        <div className={styles.codeInputs}>
                            {verificationCode.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`code-${index}`}
                                    type="text"
                                    maxLength={1}
                                    className={styles.codeInput}
                                    value={digit}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                />
                            ))}
                        </div>
                        <div className={styles.resendSection}>
                            <span>Bạn không nhận được mã?</span>
                            {countdown > 0 ? (
                                <span className={styles.countdown}>Gửi lại ({countdown}s)</span>
                            ) : (
                                <button className={styles.resendButton} onClick={handleResendCode}>
                                    Gửi lại
                                </button>
                            )}
                        </div>
                        <button
                            className={styles.primaryButton}
                            onClick={handleVerify}
                            disabled={verificationCode.join('').length !== 6}
                        >
                            Tiếp tục
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
