import { getCookie } from '@/app/actions/cookie';
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

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const response = await apiRequest<{ accessToken: string; refreshToken: string }>('auth/refresh-token', 'POST', {
        refreshToken,
      });

      if (!response?.accessToken || !response?.refreshToken) {
        throw new Error('Invalid token response');
      }

      return response;
    } catch (error) {
      console.error('Refresh token request failed:', error);
      throw error;
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

  async forgotPassword(email: string): Promise<boolean> {
    try {
      await apiRequest('auth/forgot-password', 'POST', { email });
      return true;
    } catch (error) {
      console.error('Forgot password request failed:', error);
      throw error; // Re-throw to handle in component
    }
  },

  async verifyPasswordResetCode(code: string): Promise<boolean> {
    try {
      await apiRequest(`auth/verify-password?code=${code}`, 'GET');
      return true;
    } catch (error) {
      console.error('Password reset code verification failed:', error);
      throw error;
    }
  },

  async setNewPassword(password: string, code: string): Promise<boolean> {
    try {
      await apiRequest('auth/new-password', 'POST', { password, code });
      return true;
    } catch (error) {
      console.error('Set new password failed:', error);
      throw error;
    }
  },

  async serverRefreshToken(): Promise<{ accessToken: string; refreshToken: string } | null> {
    const refreshToken = await getCookie('refreshToken');
    if (!refreshToken) {
      return null;
    }
    return this.refreshToken(refreshToken);
  },

};

export default authRequests;
