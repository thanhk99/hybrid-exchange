'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AiFillGoogleCircle } from 'react-icons/ai';
import TopMenuList from '../../components/shared/top-menu-list/TopMenuList';
import ProfileSection from '../../components/profile/ProfileSection';
import ProfileField from '../../components/profile/ProfileField';
import ProfileAvatar from '../../components/profile/ProfileAvatar';
import { profileService } from '../../services/profileService';
import { UserProfile } from '../../types/profile';
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
        const response = await profileService.getProfile();
        if (response.success) {
          setProfile(response.data);
        } else {
          setError(response.message || 'Failed to fetch profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
        // For development, set mock data if API fails
        setProfile({
          id: '719618597119037951',
          email: 'nhu***@gmail.com',
          nickname: 'nhu***@gmail.com',
          isEmailVerified: true,
          isIdentityVerified: true,
          country: 'Việt Nam',
          phone: '****821',
          phoneVerified: true,
          twoFactorEnabled: false,
          tradingTier: 'Người dùng thông thường',
          referralRate: '0%',
          thirdPartyLogin: {
            google: true
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarChange = async (file: File) => {
    try {
      const response = await profileService.updateAvatar(file);
      if (response.success && profile) {
        setProfile({ ...profile, avatar: response.data.avatar });
      }
    } catch (err) {
      console.error('Error updating avatar:', err);
    }
  };

  const handleEditNickname = () => {
    // Navigate to edit nickname page or open modal
    console.log('Edit nickname');
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
          <ProfileSection title="Thông tin cá nhân">
            <ProfileAvatar 
              avatar={profile.avatar}
              onAvatarChange={handleAvatarChange}
            />
            
            <ProfileField
              label="Biệt danh"
              value={profile.nickname || profile.email}
              actionType="edit"
              actionText="Thay đổi"
              onAction={handleEditNickname}
            />
            
            <ProfileField
              label="ID người dùng"
              value={profile.id}
              actionType="copy"
              actionText="Sao chép"
            />
          </ProfileSection>

          {/* Verification Information Section */}
          <ProfileSection title="Thông tin xác minh">
            <ProfileField
              label="Xác minh danh tính"
              value="Đã xác minh"
              actionType="view"
              actionText="Xem chi tiết"
              onAction={handleViewIdentityDetails}
              isVerified={profile.isIdentityVerified}
            />
            
            <ProfileField
              label="Quốc gia/Khu vực"
              value={profile.country}
              actionType="view"
              actionText="Xem chi tiết"
              onAction={handleViewCountryDetails}
            />
          </ProfileSection>

          {/* Account Details Section */}
          <ProfileSection title="Chi tiết tài khoản">
            <ProfileField
              label="Email"
              value={profile.email}
              actionType="edit"
              actionText="Thay đổi"
              onAction={handleEditEmail}
            />
            
            <ProfileField
              label="Số điện thoại"
              value={profile.phone || 'Chưa cập nhật'}
              actionType="edit"
              actionText="Thay đổi"
              onAction={handleEditPhone}
            />
            
            <div className="flex items-center py-3 border-b border-gray-100">
              <span className="flex-1 text-gray-900 font-medium">Đăng nhập qua bên thứ ba</span>
              <div className="flex-1 flex items-center gap-2">
                {profile.thirdPartyLogin?.google && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <AiFillGoogleCircle size={16} className="text-red-500" />
                    <span>Google</span>
                  </div>
                )}
                {!profile.thirdPartyLogin?.google && (
                  <span className="text-gray-600">Chưa liên kết</span>
                )}
              </div>
              <button
                onClick={handleManageThirdParty}
                className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                Quản lý
              </button>
            </div>
            
            <ProfileField
              label="Bậc phí giao dịch"
              value={profile.tradingTier}
              actionType="view"
              actionText="Xem chi tiết"
              onAction={handleViewTradingTier}
            />
            
            <ProfileField
              label="Quyền lợi khi mời"
              value={profile.referralRate}
              actionType="view"
              actionText="Xem chi tiết"
              onAction={handleViewReferralDetails}
            />
          </ProfileSection>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;