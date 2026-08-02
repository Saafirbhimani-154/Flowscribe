export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ConfirmSlugRequest {
  slugId: string;
}

export interface UpdateSettingsRequest {
  language?: string;
  theme?: string;
  timezone?: string;
}

export interface UserProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  slugId: string;
  isSlugSet: boolean;
  role: {
    id: string;
    name: string;
  };
  profile: {
    language: string;
    theme: string;
    timezone: string;
  } | null;
  createdAt: Date;
}

export interface UsageResponse {
  count: number;
  limit: number;
}
