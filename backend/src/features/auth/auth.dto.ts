export interface RegisterUserDto {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface AuthUserDto {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "inactive";
  profileImageUrl?: string | null;
}

export interface AuthResponseDto {
  message: string;
  user: AuthUserDto;
  accessToken: string;
}

export interface RefreshResponseDto {
  message: string;
  user: AuthUserDto;
  accessToken: string;
}
