'use client';

import React, { useState } from 'react';
import { GlobalOutlined, BellOutlined, EyeOutlined } from '@ant-design/icons';
import InfoCard from '@/src/components/common/InfoCard/InfoCard';
import SettingRow from '@/src/components/common/SettingRow/SettingRow';
import styles from './page.module.css';

export default function PreferencesPage() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [tradeAlerts, setTradeAlerts] = useState(false);
    const [priceAlerts, setPriceAlerts] = useState(true);
    const [newsletter, setNewsletter] = useState(false);

    return (
        <div className={styles.preferencesPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Tùy chọn</h1>
                <p className={styles.pageSubtitle}>Cài đặt ngôn ngữ, tiền tệ và thông báo</p>
            </div>

            {/* Language & Currency */}
            <InfoCard title="Ngôn ngữ & Tiền tệ" icon={<GlobalOutlined />}>
                <div className={styles.settingGroup}>
                    <div className={styles.settingItem}>
                        <label className={styles.label}>Ngôn ngữ</label>
                        <select className={styles.select}>
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English</option>
                            <option value="zh">中文</option>
                        </select>
                    </div>
                    <div className={styles.settingItem}>
                        <label className={styles.label}>Tiền tệ hiển thị</label>
                        <select className={styles.select}>
                            <option value="usd">USD - Đô la Mỹ</option>
                            <option value="vnd">VND - Việt Nam Đồng</option>
                            <option value="eur">EUR - Euro</option>
                        </select>
                    </div>
                </div>
            </InfoCard>

            {/* Notifications */}
            <InfoCard title="Thông báo" icon={<BellOutlined />}>
                <SettingRow
                    label="Thông báo qua Email"
                    description="Nhận thông báo về giao dịch qua email"
                    value={emailNotifications}
                    onChange={setEmailNotifications}
                />
                <SettingRow
                    label="Thông báo đẩy"
                    description="Nhận thông báo đẩy trên thiết bị di động"
                    value={pushNotifications}
                    onChange={setPushNotifications}
                />
                <SettingRow
                    label="Cảnh báo giao dịch"
                    description="Thông báo khi có giao dịch mới"
                    value={tradeAlerts}
                    onChange={setTradeAlerts}
                />
                <SettingRow
                    label="Cảnh báo giá"
                    description="Thông báo khi giá thay đổi đáng kể"
                    value={priceAlerts}
                    onChange={setPriceAlerts}
                />
            </InfoCard>

            {/* Privacy */}
            <InfoCard title="Quyền riêng tư" icon={<EyeOutlined />}>
                <SettingRow
                    label="Nhận bản tin"
                    description="Nhận email về tin tức và cập nhật sản phẩm"
                    value={newsletter}
                    onChange={setNewsletter}
                />
            </InfoCard>

            <button className={styles.saveButton}>Lưu thay đổi</button>
        </div>
    );
}
