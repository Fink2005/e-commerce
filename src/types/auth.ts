import type { LoginFormData, RegisterFormData } from '@/app/schema/auth';

export type VerifyKycResponse = {
  user: User;
  accessToken: string;
};

export type LoginPayload = LoginFormData;
export type RegisterPayload = RegisterFormData;

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  roles?: string[];
};

export type AuthResponse = {
  user: User;
} & TokenResponse;

export type LoginResponse = {
  result: AuthResponse;
} | null;

export type RegisterResponse = AuthResponse | null;
