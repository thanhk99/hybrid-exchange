'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CloseOutlined } from '@ant-design/icons';
import { useUser } from '../../../contexts/UserContext';
import UserService from '../../../services/user';
import styles from './page.module.css';

export default function ChangePhonePage() {
    const router = useRouter();
    const { user, refreshUser } = useUser();
    const [showVerifyModal, setShowVerifyModal] = useState(true);
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(60);
    const [newPhone, setNewPhone] = useState('');
    const [phoneCode, setPhoneCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    const handleSendPhoneCode = () => {
        if (!newPhone) {
            setError('Vui lòng nhập số điện thoại');
            return;
        }

        // Validate phone number format (Vietnamese phone number)
        const phoneRegex = /^(0|\+84)[0-9]{9}$/;
        if (!phoneRegex.test(newPhone)) {
            setError('Số điện thoại không hợp lệ');
            return;
        }

        setError('');
        setCountdown(60);
        // TODO: Call API to send verification code to phone
        setSuccess('Mã xác minh đã được gửi đến số điện thoại của bạn');
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');

        if (!newPhone || !phoneCode) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        // Validate phone number format
        const phoneRegex = /^(0|\+84)[0-9]{9}$/;
        if (!phoneRegex.test(newPhone)) {
            setError('Số điện thoại không hợp lệ');
            return;
        }

        setLoading(true);

        try {
            const response = await UserService.changePhone(newPhone);

            // Check if response is successful (has data or status is 200/201)
            if ((response.data && response.data.data) || response.status === 200 || response.status === 201) {
                setSuccess('Thay đổi số điện thoại thành công!');
                // Refresh user data
                await refreshUser();

                // Redirect after 2 seconds
                setTimeout(() => {
                    router.push('/account/security');
                }, 2000);
            } else {
                setError(response.data?.message || 'Thay đổi số điện thoại thất bại');
            }
        } catch (err: any) {
            console.error('Change phone error:', err);
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    const maskedPhone = user?.phone
        ? user.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')
        : '***';

    return (
        <div className={styles.changePhonePage}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <span onClick={() => router.push('/account/security')}>Trung tâm bảo mật</span>
                <span className={styles.separator}>›</span>
                <span>Thay đổi số điện thoại</span>
            </div>

            <h1 className={styles.pageTitle}>Thay đổi số điện thoại</h1>

            {/* Current Phone Info */}
            {user?.phone && (
                <div className={styles.infoBox}>
                    <div className={styles.infoLabel}>Số điện thoại hiện tại</div>
                    <div className={styles.infoValue}>{maskedPhone}</div>
                </div>
            )}

            {/* Form */}
            <div className={styles.formSection}>
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

                <div className={styles.formGroup}>
                    <label>Số điện thoại mới</label>
                    <input
                        type="tel"
                        className={styles.input}
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="Nhập số điện thoại (VD: 0912345678)"
                    />
                    <div className={styles.hint}>
                        Định dạng: 0XXXXXXXXX hoặc +84XXXXXXXXX
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Mã xác minh SMS</label>
                    <div className={styles.inputWithButton}>
                        <input
                            type="text"
                            className={styles.input}
                            value={phoneCode}
                            onChange={(e) => setPhoneCode(e.target.value)}
                            placeholder="Nhập mã xác minh"
                        />
                        <button
                            className={styles.sendButton}
                            onClick={handleSendPhoneCode}
                            disabled={countdown > 0 && countdown < 60}
                        >
                            {countdown > 0 && countdown < 60 ? `${countdown}s` : 'Gửi'}
                        </button>
                    </div>
                </div>

                <button
                    className={styles.submitButton}
                    onClick={handleSubmit}
                    disabled={!newPhone || !phoneCode || loading}
                >
                    {loading ? 'Đang xử lý...' : 'Xác nhận'}
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
                                Chúng tôi đã gửi mã gồm 6 chữ số đến {user?.email ?
                                    user.email.replace(/(.{3}).*(@.*)/, '$1***$2') :
                                    'email của bạn'}.
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
