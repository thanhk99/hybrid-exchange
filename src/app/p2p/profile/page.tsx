'use client';

import { useState, useEffect } from 'react';
import { EditOutlined, TrophyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import UserRating from '@/src/components/P2P/UserRating/UserRating';
import { UserP2PStats } from '@/src/types/p2p';
import P2PService from '@/src/services/p2p';
import ProtectedRoute from '@/src/components/common/ProtectedRoute/ProtectedRoute';
import styles from './page.module.css';

export default function P2PProfilePage() {
    const [stats, setStats] = useState<UserP2PStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await P2PService.getUserStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Đang tải...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className={styles.error}>
                <p>Không thể tải thông tin hồ sơ</p>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Hồ sơ P2P của tôi</h1>
                    <p className={styles.subtitle}>Thống kê và thành tích giao dịch P2P</p>
                </div>

                {/* Profile Card */}
                <div className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatar}>
                            <span>👤</span>
                        </div>
                        <div className={styles.profileInfo}>
                            <h2 className={styles.userName}>User Name</h2>
                            <div className={styles.verified}>
                                <CheckCircleOutlined /> ID đã xác minh
                            </div>
                        </div>
                        <button className={styles.editButton}>
                            <EditOutlined /> Chỉnh sửa
                        </button>
                    </div>

                    <div className={styles.ratingSection}>
                        <UserRating
                            rating={stats.rating}
                            completedTrades={stats.completedTrades}
                            completionRate={stats.completionRate}
                            size="large"
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statContent}>
                            <div className={styles.statLabel}>Tổng giao dịch</div>
                            <div className={styles.statValue}>{stats.totalTrades}</div>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statContent}>
                            <div className={styles.statLabel}>Hoàn thành</div>
                            <div className={styles.statValue}>{stats.completedTrades}</div>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statContent}>
                            <div className={styles.statLabel}>Tỷ lệ hoàn thành</div>
                            <div className={styles.statValue}>{stats.completionRate.toFixed(1)}%</div>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statContent}>
                            <div className={styles.statLabel}>Thời gian giải phóng TB</div>
                            <div className={styles.statValue}>{stats.avgReleaseTime} phút</div>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <div className={styles.reviewsCard}>
                    <h3 className={styles.cardTitle}>Đánh giá</h3>
                    <div className={styles.reviewsStats}>
                        <div className={styles.reviewStat}>
                            <div className={styles.reviewContent}>
                                <div className={styles.reviewLabel}>Tích cực</div>
                                <div className={styles.reviewValue}>{stats.positiveReviews}</div>
                            </div>
                        </div>
                        <div className={styles.reviewStat}>
                            <div className={styles.reviewContent}>
                                <div className={styles.reviewLabel}>Tiêu cực</div>
                                <div className={styles.reviewValue}>{stats.negativeReviews}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                <div className={styles.achievementsCard}>
                    <h3 className={styles.cardTitle}>Thành tích</h3>
                    <div className={styles.achievements}>
                        {stats.completedTrades >= 10 && (
                            <div className={styles.achievement}>
                                <div className={styles.achievementContent}>
                                    <div className={styles.achievementName}>Người giao dịch mới</div>
                                    <div className={styles.achievementDesc}>Hoàn thành 10 giao dịch</div>
                                </div>
                            </div>
                        )}
                        {stats.completedTrades >= 50 && (
                            <div className={styles.achievement}>
                                <div className={styles.achievementContent}>
                                    <div className={styles.achievementName}>Người giao dịch chuyên nghiệp</div>
                                    <div className={styles.achievementDesc}>Hoàn thành 50 giao dịch</div>
                                </div>
                            </div>
                        )}
                        {stats.completionRate >= 95 && (
                            <div className={styles.achievement}>
                                <div className={styles.achievementContent}>
                                    <div className={styles.achievementName}>Đáng tin cậy</div>
                                    <div className={styles.achievementDesc}>Tỷ lệ hoàn thành {'>'} 95%</div>
                                </div>
                            </div>
                        )}
                        {stats.rating >= 4.5 && (
                            <div className={styles.achievement}>
                                <div className={styles.achievementContent}>
                                    <div className={styles.achievementName}>Đánh giá cao</div>
                                    <div className={styles.achievementDesc}>Rating {'>'} 4.5 sao</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
