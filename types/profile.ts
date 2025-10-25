// types/profile.ts
export interface ProfileStats {
  repairsManaged: number;
  totalRevenue: string;
  avgRating: number;
  activeRepairs: number;
}

export interface ProfilePreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  language: string;
  timezone: string;
}

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  address: string;
  joinDate: string;
  avatar: string;
  stats: ProfileStats;
  preferences: ProfilePreferences;
}