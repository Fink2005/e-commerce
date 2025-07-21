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
  role?: 'CUSTOMER' | 'ADMIN';
  isEmailConfirmed?: boolean;
  roles?: string[];
  created_at?: string;
  updated_at?: string;
};

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

// New login response matching your backend
export type LoginResponse = {
  role: 'CUSTOMER' | 'ADMIN';
  isEmailConfirmed: boolean;
} | null;

export type RegisterResponse = {
  success: boolean;
  message?: string;
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
