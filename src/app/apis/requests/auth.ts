import apiRequest from '@/app/apis/apiRequest';
import type { LoginFormData, RegisterFormData } from '@/app/schema/auth';

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

const authRequests = {
  async login(body: LoginPayload): Promise<LoginResponse> {
    return await apiRequest<LoginResponse>('/auth/login', 'POST', body);
  },

  async register(body: RegisterPayload): Promise<RegisterResponse> {
    return await apiRequest<RegisterResponse>('/auth/register', 'POST', body);
  },
};

export default authRequests;
