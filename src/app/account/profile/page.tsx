'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AiFillGoogleCircle, AiOutlineEdit, AiOutlineCopy, AiTwotoneEye, AiFillCheckCircle } from 'react-icons/ai';
import TopMenuList from '../../components/shared/top-menu-list/TopMenuList';
import { profileService } from '../../services/profileService';
import { UserProfile } from '../../types/profile';
import { API_CONFIG } from '../../lib/constants';
import styles from './profile.module.css';

const ProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const menuItems = [
    { 
      title: 'Tổng quát', 
      onClick: () => router.push('/account/overview')
    },
    { 
      title: 'Thông tin', 
      onClick: () => router.push('/account/profile')
    },
    { 
      title: 'Cài đặt bảo mật', 
      onClick: () => router.push('/account/security')
    },
    { 
      title: 'Xác minh', 
      onClick: () => router.push('/account/verification')
    },
    { 
      title: 'Tùy chọn', 
      onClick: () => router.push('/account/preferences')
    },
    { 
      title: 'Tài khoản phụ', 
      onClick: () => router.push('/account/sub-accounts')
    },
    { 
      title: 'API', 
      onClick: () => router.push('/account/api')
    },
    { 
      title: 'Ủy quyền của bên thứ ba', 
      onClick: () => router.push('/account/third-party')
    },
  ];

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching profile from:', API_CONFIG.ENDPOINTS.USER.GETFULLPROFILE);
        const response = await profileService.getProfile();
        console.log('Profile response:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', response ? Object.keys(response) : 'No response');
        
        if (response && response.message === 'success' && response.data) {
          setProfile(response.data);
        } else {
          console.error('Invalid response format:', response);
          setError(response?.message || 'Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err instanceof Error) {
          setError(`Failed to load profile data: ${err.message}`);
        } else {
          setError('Failed to load profile data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarChange = async (file: File) => {
    try {
      const response = await profileService.updateAvatar(file);
      if (response.message === 'success' && profile) {
        // Cập nhật avatar nếu cần
        console.log('Avatar updated successfully');
      }
    } catch (err) {
      console.error('Error updating avatar:', err);
    }
  };

  const handleEditUsername = () => {
    // Navigate to edit username page or open modal
    console.log('Edit username');
  };

  const handleEditEmail = () => {
    // Navigate to edit email page or open modal
    console.log('Edit email');
  };

  const handleEditPhone = () => {
    // Navigate to edit phone page or open modal
    console.log('Edit phone');
  };

  const handleViewIdentityDetails = () => {
    router.push('/account/verification/identity');
  };

  const handleViewCountryDetails = () => {
    router.push('/account/verification/country');
  };

  const handleManageThirdParty = () => {
    router.push('/account/third-party');
  };

  const handleViewTradingTier = () => {
    router.push('/account/trading-tier');
  };

  const handleViewReferralDetails = () => {
    router.push('/account/referral');
  };

  // Hàm mask email để hiển thị
  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    if (username.length <= 3) return email;
    return username.substring(0, 3) + '***@' + domain;
  };

  // Hàm mask phone number
  const maskPhone = (phone: string) => {
    if (phone.length <= 4) return phone;
    return '****' + phone.slice(-4);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.topMenu}>
          <TopMenuList menuItems={menuItems} />
        </div>
        <div className={styles.contentWrapper}>
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className={styles.container}>
        <div className={styles.topMenu}>
          <TopMenuList menuItems={menuItems} />
        </div>
        <div className={styles.contentWrapper}>
          <div className="flex items-center justify-center py-12">
            <div className="text-red-500">Lỗi: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className={styles.container}>
      <div className={styles.topMenu}>
        <TopMenuList menuItems={menuItems} />
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.card}>
          <h2 className={styles.title}>Thông tin</h2>
          
          {/* Personal Information Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin cá nhân</h3>
            
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="text-gray-400 text-2xl">👤</div>
                )}
                <div className={styles.avatarEditIcon}>
                  <AiOutlineEdit size={12} />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{profile.username}</h4>
                <p className="text-sm text-gray-500">Cập nhật ảnh đại diện</p>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <span className={styles.label}>Biệt danh</span>
              <span className={styles.value}>{profile.username}</span>
              <button className={styles.actionButton} onClick={handleEditUsername}>
                <AiOutlineEdit size={14} />
                Thay đổi
              </button>
            </div>
            
            <div className={styles.formRow}>
              <span className={styles.label}>ID người dùng</span>
              <span className={styles.value}>{profile.uid}</span>
              <button className={styles.actionButton} onClick={() => navigator.clipboard.writeText(profile.uid)}>
                <AiOutlineCopy size={14} />
                Sao chép
              </button>
            </div>
          </div>

          {/* Verification Information Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin xác minh</h3>
            
            <div className={styles.formRow}>
              <span className={styles.label}>Xác minh danh tính</span>
              <div className={styles.value}>
                {profile.verified ? (
                  <span className={styles.verifiedText}>
                    <AiFillCheckCircle className={styles.verifiedIcon} />
                    Đã xác minh
                  </span>
                ) : (
                  <span className="text-gray-500">Chưa xác minh</span>
                )}
              </div>
              <button className={styles.actionButton} onClick={handleViewIdentityDetails}>
                <AiTwotoneEye size={14} />
                Xem chi tiết
              </button>
            </div>
            
            <div className={styles.formRow}>
              <span className={styles.label}>Quốc gia/Khu vực</span>
              <span className={styles.value}>{profile.nation}</span>
              <button className={styles.actionButton} onClick={handleViewCountryDetails}>
                <AiTwotoneEye size={14} />
                Xem chi tiết
              </button>
            </div>
          </div>

          {/* Account Details Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Chi tiết tài khoản</h3>
            
            <div className={styles.formRow}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{maskEmail(profile.email)}</span>
              <button className={styles.actionButton} onClick={handleEditEmail}>
                <AiOutlineEdit size={14} />
                Thay đổi
              </button>
            </div>
            
            <div className={styles.formRow}>
              <span className={styles.label}>Số điện thoại</span>
              <span className={styles.value}>
                {profile.phoneNumber ? (
                  <span className={styles.phoneMasked}>{maskPhone(profile.phoneNumber)}</span>
                ) : (
                  'Chưa cập nhật'
                )}
              </span>
              <button className={styles.actionButton} onClick={handleEditPhone}>
                <AiOutlineEdit size={14} />
                Thay đổi
              </button>
            </div>
            
            <div className={styles.thirdPartySection}>
              <span className={styles.thirdPartyLabel}>Đăng nhập qua bên thứ ba</span>
              <div className={styles.thirdPartyValue}>
                <AiFillGoogleCircle className={styles.googleIcon} size={20} />
                <span className="text-gray-600">Google</span>
              </div>
              <button className={styles.manageButton} onClick={handleManageThirdParty}>
                Quản lý
              </button>
            </div>
            
            <div className={styles.formRow}>
              <span className={styles.label}>Bậc phí giao dịch</span>
              <span className={styles.value}>{profile.leveFee}</span>
              <button className={styles.actionButton} onClick={handleViewTradingTier}>
                <AiTwotoneEye size={14} />
                Xem chi tiết
              </button>
            </div>

            <div className={styles.formRow}>
              <span className={styles.label}>Trạng thái tài khoản</span>
              <span className={styles.value}>
                <span className={`${styles.statusBadge} ${profile.active ? styles.statusActive : styles.statusInactive}`}>
                  {profile.active ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;