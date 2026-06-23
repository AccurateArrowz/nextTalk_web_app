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
  profileImageUrl?: string | null;
}

export interface AuthResponseDto {
  message: string;
  user: AuthUserDto;
  accessToken: string;
}
