'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import PasswordService from '../../../services/password';
import styles from './page.module.css';

export default function ChangePasswordPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Mật khẩu mới không khớp');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        if (formData.oldPassword === formData.newPassword) {
            setError('Mật khẩu mới không được trùng với mật khẩu cũ');
            return;
        }

        setLoading(true);

        try {
            const response = await PasswordService.changePassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            });

            if ((response.data && response.data.data) || response.status === 200 || response.status === 201) {
                setSuccess('Đổi mật khẩu thành công!');
                setFormData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });

                setTimeout(() => {
                    router.push('/account/security');
                }, 2000);
            } else {
                setError(response.data?.message || 'Đổi mật khẩu thất bại');
            }
        } catch (err: any) {
            console.error('Change password error:', err);
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.changePasswordPage}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <span onClick={() => router.push('/account/security')}>Trung tâm bảo mật</span>
                <span className={styles.separator}>›</span>
                <span>Đổi mật khẩu</span>
            </div>

            <h1 className={styles.pageTitle}>Đổi mật khẩu đăng nhập</h1>

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

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Mật khẩu cũ</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showOldPassword ? "text" : "password"}
                                className={styles.input}
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu cũ"
                            />
                            <span
                                className={styles.eyeIcon}
                                onClick={() => setShowOldPassword(!showOldPassword)}
                            >
                                {showOldPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                            </span>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Mật khẩu mới</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                className={styles.input}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu mới"
                            />
                            <span
                                className={styles.eyeIcon}
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                            </span>
                        </div>
                        <div className={styles.hint}>
                            Mật khẩu phải có ít nhất 6 ký tự
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Xác nhận mật khẩu mới</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className={styles.input}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Nhập lại mật khẩu mới"
                            />
                            <span
                                className={styles.eyeIcon}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading || !formData.oldPassword || !formData.newPassword || !formData.confirmPassword}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                </form>
            </div>
        </div>
    );
}
