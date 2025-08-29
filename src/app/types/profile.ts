export interface UserProfile {
  id: string;
  email: string;
  nickname?: string;
  avatar?: string;
  isEmailVerified: boolean;
  isIdentityVerified: boolean;
  country: string;
  phone?: string;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  tradingTier: string;
  referralRate: string;
  thirdPartyLogin?: {
    google?: boolean;
    facebook?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProfileApiResponse {
  success: boolean;
  data: UserProfile;
  message?: string;
}