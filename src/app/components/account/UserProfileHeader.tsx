import React from 'react';
import { CopyOutlined, CheckCircleOutlined, GoogleOutlined } from '@ant-design/icons';
import { VerificationStatus, UserTier } from '../../accountOverviewMockData';
import styles from './UserProfileHeader.module.css';

interface UserProfileHeaderProps {
  email: string;
  userId: string;
  avatar: string;
  verificationStatus: VerificationStatus;
  country: string;
  tier: UserTier;
  isGoogleLinked: boolean;
  onViewProfile: () => void;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  email,
  userId,
  avatar,
  verificationStatus,
  country,
  tier,
  isGoogleLinked,
  onViewProfile
}) => {
  const handleCopyUserId = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy user ID:', err);
    }
  };

  const maskEmail = (email: string): string => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.substring(0, 3) + '***';
    return `${maskedUsername}@${domain}`;
  };

  const formatUserId = (userId: string): string => {
    return userId.replace(/(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d{2})/, '$1$2$3$4$5$6');
  };

  return (
    <div className={styles.container}>
      <div className={styles.userSection}>
        <div className={styles.avatarContainer}>
          <img 
            src={avatar} 
            alt="User avatar"
            className={styles.avatar}
            width="48"
            height="48"
          />
        </div>
        
        <div className={styles.userInfo}>
          <div className={styles.emailRow}>
            <span className={styles.email}>{maskEmail(email)}</span>
            <div className={styles.badges}>
              <span className={styles.emailLabel}>Email</span>
              <div className={styles.verificationBadge}>
                <CheckCircleOutlined className={styles.verifiedIcon} />
                <span>Đã xác minh</span>
              </div>
            </div>
          </div>
          
          <div className={styles.userIdRow}>
            <span className={styles.userId}>{formatUserId(userId)}</span>
            <button 
              onClick={handleCopyUserId}
              className={styles.copyButton}
              title="Copy User ID"
            >
              <CopyOutlined />
            </button>
            {isGoogleLinked && (
              <GoogleOutlined className={styles.googleIcon} />
            )}
          </div>
        </div>
      </div>

      <div className={styles.additionalInfo}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Xác minh danh tính</span>
          <div className={styles.infoValue}>
            <CheckCircleOutlined className={styles.verifiedIcon} />
            <span>Đã xác minh</span>
          </div>
        </div>
        
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Quốc gia/Khu vực</span>
          <span className={styles.infoValue}>{country}</span>
        </div>
        
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Bậc phí giao dịch</span>
          <span className={styles.infoValue}>Người dùng thông thường</span>
        </div>
      </div>

      <button 
        onClick={onViewProfile}
        className={styles.viewProfileButton}
      >
        Xem hồ sơ
      </button>
    </div>
  );
};

export default UserProfileHeader;