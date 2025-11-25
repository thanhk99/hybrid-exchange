'use client';

import React from 'react';
import { SafetyOutlined, IdcardOutlined, FileTextOutlined } from '@ant-design/icons';
import InfoCard from '@/src/components/common/InfoCard/InfoCard';
import StatusBadge from '@/src/components/common/StatusBadge/StatusBadge';
import styles from './page.module.css';

export default function VerificationPage() {
    return (
        <div className={styles.verificationPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Xác minh danh tính</h1>
                <p className={styles.pageSubtitle}>Hoàn thành KYC để tăng giới hạn giao dịch</p>
            </div>

            {/* Verification Levels */}
            <InfoCard title="Cấp độ xác minh" icon={<SafetyOutlined />}>
                <div className={styles.levelList}>
                    <div className={styles.levelItem}>
                        <div className={styles.levelInfo}>
                            <h4>Cấp 1 - Xác minh cơ bản</h4>
                            <p>Email và số điện thoại</p>
                            <StatusBadge status="verified" label="Đã hoàn thành" />
                        </div>
                        <div className={styles.levelLimit}>
                            <span>Giới hạn: </span>
                            <strong>$1,000/ngày</strong>
                        </div>
                    </div>

                    <div className={styles.levelItem}>
                        <div className={styles.levelInfo}>
                            <h4>Cấp 2 - Xác minh danh tính</h4>
                            <p>CMND/CCCD hoặc Passport</p>
                            <StatusBadge status="pending" label="Đang xử lý" />
                        </div>
                        <div className={styles.levelLimit}>
                            <span>Giới hạn: </span>
                            <strong>$10,000/ngày</strong>
                        </div>
                    </div>

                    <div className={styles.levelItem}>
                        <div className={styles.levelInfo}>
                            <h4>Cấp 3 - Xác minh nâng cao</h4>
                            <p>Giấy tờ chứng minh địa chỉ</p>
                            <StatusBadge status="unverified" label="Chưa hoàn thành" />
                        </div>
                        <div className={styles.levelLimit}>
                            <span>Giới hạn: </span>
                            <strong>$50,000/ngày</strong>
                        </div>
                    </div>
                </div>
            </InfoCard>

            {/* ID Verification */}
            <InfoCard title="Xác minh CMND/CCCD" icon={<IdcardOutlined />}>
                <div className={styles.uploadSection}>
                    <p className={styles.uploadText}>Tải lên ảnh chụp CMND/CCCD hoặc Passport</p>
                    <div className={styles.uploadGrid}>
                        <div className={styles.uploadBox}>
                            <FileTextOutlined />
                            <p>Mặt trước</p>
                            <button className={styles.uploadButton}>Tải lên</button>
                        </div>
                        <div className={styles.uploadBox}>
                            <FileTextOutlined />
                            <p>Mặt sau</p>
                            <button className={styles.uploadButton}>Tải lên</button>
                        </div>
                    </div>
                    <div className={styles.uploadHint}>
                        <p>• Ảnh rõ nét, không bị mờ hoặc che khuất</p>
                        <p>• Định dạng: JPG, PNG. Kích thước tối đa: 5MB</p>
                    </div>
                </div>
            </InfoCard>

            {/* Address Verification */}
            <InfoCard title="Xác minh địa chỉ" icon={<FileTextOutlined />}>
                <div className={styles.uploadSection}>
                    <p className={styles.uploadText}>Tải lên hóa đơn điện, nước hoặc sao kê ngân hàng (trong 3 tháng gần nhất)</p>
                    <div className={styles.uploadBox}>
                        <FileTextOutlined />
                        <p>Giấy tờ chứng minh địa chỉ</p>
                        <button className={styles.uploadButton}>Tải lên</button>
                    </div>
                </div>
            </InfoCard>
        </div>
    );
}
