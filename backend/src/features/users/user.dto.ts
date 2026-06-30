export interface UserProfileDto {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "inactive";
  profileImageUrl: string | null;
}

export interface UpdateUserProfileDto {
  fullName?: string;
  email?: string;
  profileImageUrl?: string | null;
}

export interface AdminUserListItemDto extends UserProfileDto {
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserListResponseDto {
  data: AdminUserListItemDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminCreateUserDto {
  fullName: string;
  email: string;
  password: string;
  role?: "user" | "admin";
  status?: "active" | "inactive";
  profileImageUrl?: string | null;
}

export interface AdminUpdateUserDto {
  fullName?: string;
  email?: string;
  password?: string;
  role?: "user" | "admin";
  status?: "active" | "inactive";
  profileImageUrl?: string | null;
}
