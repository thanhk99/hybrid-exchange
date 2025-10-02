export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  nation: string;
  phoneNumber?: string;
  leveFee: string;
  active: boolean;
  verified: boolean;
  avatar?: string;
}

export interface ProfileApiResponse {
  message: string;
  data: UserProfile;
}

export interface LoginDevice {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  region: string;
  country: string;
  lastLoginAt: string;
  lastActiveAt: string;
  isCurrentDevice: boolean;
  isTrusted: boolean;
}

export interface DevicesApiResponse {
  message: string;
  data: LoginDevice[];
}