'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../contexts/UserContext';
import UserService from '../../../services/user';
import styles from './page.module.css';

export default function ChangeNamePage() {
    const router = useRouter();
    const { user, refreshUser } = useUser();
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!newName || newName.trim().length === 0) {
            setError('Vui lòng nhập tên mới');
            return;
        }

        if (newName.trim().length < 2) {
            setError('Tên phải có ít nhất 2 ký tự');
            return;
        }

        if (newName.trim().length > 50) {
            setError('Tên không được vượt quá 50 ký tự');
            return;
        }

        setLoading(true);

        try {
            const response = await UserService.changeName(newName.trim());

            // Check if response is successful (has data or status is 200/201)
            if ((response.data && response.data.data) || response.status === 200 || response.status === 201) {
                setSuccess('Thay đổi tên thành công!');
                // Refresh user data
                await refreshUser();

                // Redirect after 2 seconds
                setTimeout(() => {
                    router.push('/account/profile');
                }, 2000);
            } else {
                setError(response.data?.message || 'Thay đổi tên thất bại');
            }
        } catch (err: any) {
            console.error('Change name error:', err);
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.changeNamePage}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <span onClick={() => router.push('/account/profile')}>Hồ sơ</span>
                <span className={styles.separator}>›</span>
                <span>Thay đổi tên</span>
            </div>

            <h1 className={styles.pageTitle}>Thay đổi tên hiển thị</h1>

            {/* Current Name Info */}
            {user?.username && (
                <div className={styles.infoBox}>
                    <div className={styles.infoLabel}>Tên hiện tại</div>
                    <div className={styles.infoValue}>{user.username}</div>
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

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Tên mới</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Nhập tên mới"
                            maxLength={50}
                            required
                        />
                        <div className={styles.hint}>
                            Tên phải có từ 2-50 ký tự
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={!newName || loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                </form>
            </div>
        </div>
    );
}
