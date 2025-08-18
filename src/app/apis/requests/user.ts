import apiRequest from '@/app/apis/apiRequest';
import { USER_RANKING_LIMIT } from '@/libs/shared/constants/globals';
import type { VerifyKycResponse } from '@/types/auth';
import type { UserRanking } from '@/types/user';

const userRequests = {
  async getAllEnquiries(): Promise<{ issues: string; description: string } | null> {
    return await apiRequest<{ issues: string; description: string } | null>(
      '/user/support',
      'GET'
    );
  },
  async postEnquiry(body: { issues: string; description: string }): Promise<{ success: boolean } | null> {
    return await apiRequest<{ success: boolean } | null>(
      '/user/support',
      'POST',
      body
    );
  },
  async respondEnquiry(body: { resolution: string; userId: number; userIssue: string; supportId: number }): Promise<{ success: boolean } | null> {
    return await apiRequest<{ success: boolean } | null>(
      '/user/support/respond',
      'POST',
      body
    );
  },
  async userRanking(page: number): Promise<UserRanking | null> {
    return await apiRequest<UserRanking | null>(
      `/user/ranking?page=${page}?limit=${USER_RANKING_LIMIT}`,
      'GET'
    );
  },
  async resendOtp(): Promise<{ message: string } | null> {
    return await apiRequest<{ message: string } | null>(
      '/user/resend-otp',
      'PATCH'
    );
  },
  async verifyKyc(body: { kycOtp: string }): Promise<VerifyKycResponse | null> {
    return await apiRequest<VerifyKycResponse | null>(
      '/user/verify-kyc',
      'PATCH',
      body
    );
  },
  async userKyc(body: { email: string }): Promise<{ message: string } | null> {
    return await apiRequest<{ message: string } | null>(
      '/user/kyc',
      'PATCH',
      body
    );
  },
};

export default userRequests;
