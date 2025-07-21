import apiRequest from '@/app/apis/apiRequest';
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, TokenResponse } from '@/types/auth';

const authRequests = {
  async login(body: LoginPayload): Promise<LoginResponse> {
    try {
      return await apiRequest<TokenResponse>('auth/login', 'POST', body);
    } catch (error) {
      console.error('Login request failed:', error);
      return null;
    }
  },

  async register(body: RegisterPayload): Promise<RegisterResponse> {
    try {
      return await apiRequest<RegisterResponse>('auth/register', 'POST', body);
    } catch (error) {
      console.error('Register request failed:', error);
      return null;
    }
  },
};

export default authRequests;
