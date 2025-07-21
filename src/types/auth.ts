import type { LoginFormData } from '@/app/schema/auth';

export type LoginPayload = LoginFormData;
export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type User = {
  id: string | number;
  name?: string;
  username?: string;
  email: string;
  roles?: string[];
  created_at?: string;
  updated_at?: string;
};

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type LoginResponse = TokenResponse | null;

export type RegisterResponse = {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
} | null;

export type VerifyKycResponse = {
  user: User;
  accessToken: string;
};
