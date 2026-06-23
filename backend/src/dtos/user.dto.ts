export interface UserProfileDto {
  id: string;
  fullName: string;
  email: string;
  profileImageUrl: string | null;
}

export interface UpdateUserProfileDto {
  fullName?: string;
  email?: string;
  profileImageUrl?: string | null;
}
