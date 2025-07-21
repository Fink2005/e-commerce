import apiRequest from '@/app/apis/apiRequest';
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from '@/types/auth';

const authRequests = {
  async login(body: LoginPayload): Promise<LoginResponse> {
    try {
      return await apiRequest<LoginResponse>('auth/login', 'POST', body);
    } catch (error) {
      console.error('Login request failed:', error);
      throw error;
    }
  },

  async register(body: RegisterPayload): Promise<RegisterResponse> {
    try {
      return await apiRequest<RegisterResponse>('auth/register', 'POST', body);
    } catch (error) {
      console.error('Register request failed:', error);
      throw error;
    }
  },

  async refreshToken(refreshToken: string): Promise<any> {
    try {
      return await apiRequest('auth/refresh-token', 'POST', {
        refreshToken,
      });
    } catch (error) {
      console.error('Refresh token request failed:', error);
      return null;
    }
  },

  async sendConfirmationEmail(email: string): Promise<boolean> {
    try {
      await apiRequest('auth/send-email', 'POST', { email });
      return true;
    } catch (error) {
      console.error('Send confirmation email failed:', error);
      return false;
    }
  },

  async verifyEmail(code: string): Promise<boolean> {
    try {
      await apiRequest(`auth/verify-email?code=${code}`, 'GET');
      return true;
    } catch (error) {
      console.error('Email verification failed:', error);
      return false;
    }
  },
};

export default authRequests;
