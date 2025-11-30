'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    GoogleOutlined,
    KeyOutlined,
    SafetyOutlined,
    MobileOutlined,
    QrcodeOutlined,
    HistoryOutlined,
    TeamOutlined,
    BankOutlined,
    RightOutlined,
    CheckCircleFilled
} from '@ant-design/icons';
import styles from './page.module.css';

export default function SecurityPage() {
    const router = useRouter();

    return (
        <div className={styles.securityPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Bảo mật</h1>
            </div>

            {/* Trung tâm bảo mật */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Trung tâm bảo mật</h2>
                <div className={styles.securityList}>
                    <div className={styles.securityItem}>
                        <div className={styles.itemIcon}>
                            <LockOutlined />
                        </div>
                        <div className={styles.itemContent}>
                            <h3>Mức bảo mật cơ bản</h3>
                            <p>Mật khẩu đăng nhập và xác minh email để bảo vệ tài khoản của bạn</p>
                        </div>
                        <div className={styles.itemAction}>
                            <span className={styles.statusEnabled}>
                                <CheckCircleFilled /> Đã bật
                            </span>
                        </div>
                    </div>

                    <div className={styles.securityItem}>
                        <div className={styles.itemIcon}>
                            <PhoneOutlined />
                        </div>
                        <div className={styles.itemContent}>
                            <h3>Ứng dụng xác thực</h3>
                            <p>Bảo vệ tài khoản và giao dịch của bạn</p>
                        </div>
                        <div className={styles.itemAction}>
                            <button className={styles.linkButton}>Thiết lập</button>
                        </div>
                    </div>

                    <div className={styles.securityItem}>
                        <div className={styles.itemIcon}>
                            <MailOutlined />
                        </div>
                        <div className={styles.itemContent}>
                            <h3>Mã thông báo SMS</h3>
                            <p>Bảo vệ tài khoản và giao dịch của bạn</p>
                        </div>
                        <div className={styles.itemAction}>
                            <button className={styles.linkButton}>Thiết lập</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Phương thức xác thực */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Phương thức xác thực</h2>
                <div className={styles.securityList}>
                    <div className={styles.securityItem}>
                        <div className={styles.itemIcon}>
                            <KeyOutlined />
                        </div>
                        <div className={styles.itemContent}>
                            <h3>Khóa bảo mật <span className={styles.badge}>Được đề xuất</span></h3>
                            <p>Sử dụng khóa bảo mật vật lý để bảo vệ tài khoản của bạn</p>
                        </div>
                        <div className={styles.itemAction}>
                            <button className={styles.linkButton}>Quản lý <RightOutlined /></button>
                        </div>
                    </div>

                    <div className={styles.securityItem}>
                        <div className={styles.itemIcon}>
                            <SafetyOutlined />
                        </div>
                        <div className={styles.itemContent}>
                            <h3>Mã xác qua Passkey</h3>
                            <p>Sử dụng sinh trắc học hoặc mã PIN để xác minh danh tính</p>
                        </div>
                        <div className={styles.itemAction}>
                            <button className={styles.linkButton}>Quản lý <RightOutlined /></button>
                        </div>
                    </div>

                    <div className={styles.securityItem}>
                        <div className={styles.itemIcon}>
                            <GoogleOutlined />
                        </div>
                        <div className={styles.itemContent}>
                            <h3>Mã xác qua email</h3>
                            <p>Bảo vệ tài khoản và giao dịch của bạn qua mã xác nhận</p>
                        </div>
                        <div className={styles.itemAction}>
                            <span className={styles.statusInfo}>
                                abc***@gmail.com
                            </span>
                            <button
                                className={styles.linkButton}
                                onClick={() => router.push('/account/change-email')}
                            >
                                Thay đổi
                            </button>
                        </div>
                    </div>

                    <div className={styles.securityItem}>
                        <div className={styles.itemIcon}>
                            <MobileOutlined />
                        </div>
                        <div className={styles.itemContent}>
                            <h3>Số điện thoại</h3>
                            <p>Bảo vệ tài khoản và giao dịch của bạn qua SMS</p>
                        </div>
                        <div className={styles.itemAction}>
                            <button
                                className={styles.linkButton}
                                onClick={() => router.push('/account/change-phone')}
                            >
                                Thay đổi
                            </button>
                        </div>
                    </div>

                    <div className={styles.securityItem}>
                        <div className={styles.itemIcon}>
                            <MobileOutlined />
                        </div>
                        <div className={styles.itemContent}>
                            <h3>Mật khẩu ứng dụng</h3>
                            <p>Sử dụng mật khẩu ứng dụng để đăng nhập vào ứng dụng di động</p>
                        </div>
                        <div className={styles.itemAction}>
                            <button className={styles.linkButton}>Cài đặt mã</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bảo mật nâng cao */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Bảo mật nâng cao</h2>
                <div className={styles.securityList}>
                    <div className={styles.securityItem}>
                        <div className={styles.itemIcon}>
                            <QrcodeOutlined />
                        </div>
                        <div className={styles.itemContent}>
                            <h3>Lập mã khóa cấp</h3>
                            <p>Tạo mã khóa để rút tiền và thực hiện giao dịch quan trọng</p>
                        </div>
                        <div className={styles.itemAction}>
                            <button className={styles.linkButton}>Thiết lập mã</button>
                        </div>
                    </div>

                    <div className={styles.securityItem}>
                        <div className={styles.itemIcon}>
                            <TeamOutlined />
                        </div>
                        <div className={styles.itemContent}>
                            <h3>Quản lý thiết bị</h3>
                            <p>Quản lý các thiết bị đã đăng nhập vào tài khoản</p>
                        </div>
                        <div className={styles.itemAction}>
                            <button
                                className={styles.linkButton}
                                onClick={() => router.push('/account/devices')}
                            >
                                Quản lý <RightOutlined />
                            </button>
                        </div>
                    </div>

                    <div className={styles.securityItem}>
                        <div className={styles.itemIcon}>
                            <HistoryOutlined />
                        </div>
                        <div className={styles.itemContent}>
                            <h3>Quyền phiên 2FA</h3>
                            <p>Yêu cầu xác thực 2FA cho mỗi phiên đăng nhập</p>
                        </div>
                        <div className={styles.itemAction}>
                            <button className={styles.linkButton}>Tắt mã</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* An toàn cộng đồng */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>An toàn cộng đồng</h2>
                <div className={styles.securityList}>
                    <div className={styles.securityItem}>
                        <div className={styles.itemIcon}>
                            <BankOutlined />
                        </div>
                        <div className={styles.itemContent}>
                            <h3>Báo cáo các khiếu nại hoặc tranh chấp P2P</h3>
                            <p>Nếu bạn gặp vấn đề với giao dịch P2P, hãy báo cáo tại đây</p>
                        </div>
                        <div className={styles.itemAction}>
                            <RightOutlined />
                        </div>
                    </div>
                </div>
            </section>

            {/* Quản lý tài khoản */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Quản lý tài khoản</h2>
                <div className={styles.securityList}>
                    <div className={styles.securityItem}>
                        <div className={styles.itemIcon}>
                            <TeamOutlined />
                        </div>
                        <div className={styles.itemContent}>
                            <h3>Lịch sử đăng nhập</h3>
                            <p>Xem lịch sử đăng nhập và quản lý các phiên đăng nhập</p>
                        </div>
                        <div className={styles.itemAction}>
                            <RightOutlined />
                        </div>
                    </div>

                    <div className={styles.securityItem}>
                        <div className={styles.itemIcon}>
                            <LockOutlined />
                        </div>
                        <div className={styles.itemContent}>
                            <h3>Đổi mật khẩu</h3>
                            <p>Thay đổi mật khẩu đăng nhập của bạn</p>
                        </div>
                        <div className={styles.itemAction}>
                            <button
                                className={styles.linkButton}
                                onClick={() => router.push('/account/change-password')}
                            >
                                Thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
