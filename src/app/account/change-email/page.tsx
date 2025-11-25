'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CloseOutlined } from '@ant-design/icons';
import styles from './page.module.css';

export default function ChangeEmailPage() {
    const router = useRouter();
    const [showVerifyModal, setShowVerifyModal] = useState(true);
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(60);
    const [newEmail, setNewEmail] = useState('');
    const [emailCode, setEmailCode] = useState('');

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleCodeChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newCode = [...verificationCode];
            newCode[index] = value;
            setVerificationCode(newCode);

            if (value && index < 5) {
                const nextInput = document.getElementById(`verify-code-${index + 1}`);
                nextInput?.focus();
            }
        }
    };

    const handleVerify = () => {
        const code = verificationCode.join('');
        if (code.length === 6) {
            // TODO: Verify code with API
            setShowVerifyModal(false);
        }
    };

    const handleResendCode = () => {
        setCountdown(60);
        // TODO: Call API to resend code
    };

    const handleSubmit = () => {
        // TODO: Call API to change email
        router.push('/account/profile');
    };

    return (
        <div className={styles.changeEmailPage}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <span onClick={() => router.push('/account/security')}>Trung tâm bảo mật</span>
                <span className={styles.separator}>›</span>
                <span>Thay đổi email</span>
            </div>

            <h1 className={styles.pageTitle}>Thay đổi email</h1>

            {/* Form */}
            <div className={styles.formSection}>
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
                    <div className={styles.inputWithButton}>
                        <input
                            type="text"
                            className={styles.input}
                            value={emailCode}
                            onChange={(e) => setEmailCode(e.target.value)}
                            placeholder="Nhập"
                        />
                        <button className={styles.sendButton}>Gửi</button>
                    </div>
                </div>

                <button
                    className={styles.submitButton}
                    onClick={handleSubmit}
                    disabled={!newEmail || !emailCode}
                >
                    Xác nhận
                </button>
            </div>

            {/* Verify Modal */}
            {showVerifyModal && (
                <>
                    <div className={styles.modalOverlay} />
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div className={styles.stepIndicator}>1 / 2</div>
                            <button className={styles.closeButton} onClick={() => router.back()}>
                                <CloseOutlined />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <h3 className={styles.modalTitle}>Xác minh bằng email</h3>
                            <p className={styles.modalDescription}>
                                Chúng tôi đã gửi mã gồm 6 chữ số đến nhận***0604@gm***com.
                                Mã này có hiệu lực trong 10 phút và có thể nằm trong mục thư rác.
                            </p>
                            <div className={styles.codeInputs}>
                                {verificationCode.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`verify-code-${index}`}
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
                                className={styles.continueButton}
                                onClick={handleVerify}
                                disabled={verificationCode.join('').length !== 6}
                            >
                                Tiếp tục
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
