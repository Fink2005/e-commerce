import apiRequest from '@/app/apis/apiRequest';
import { USER_RANKING_LIMIT } from '@/libs/shared/constants/globals';
import type { VerifyKycResponse } from '@/types/auth';
import type { UserRanking } from '@/types/user';

const userRequests = {
  async userKyc(body: { email: string }): Promise<{ message: string } | null> {
    return await apiRequest<{ message: string } | null>(
      '/user/kyc',
      'PATCH',
      body
    );
  },
  async verifyKyc(body: { kycOtp: string }): Promise<VerifyKycResponse | null> {
    return await apiRequest<VerifyKycResponse | null>(
      '/user/verify-kyc',
      'PATCH',
      body
    );
  },
  async resendOtp(): Promise<{ message: string } | null> {
    return await apiRequest<{ message: string } | null>(
      '/user/resend-otp',
      'PATCH'
    );
  },
  async userRanking(page: number): Promise<UserRanking | null> {
    return await apiRequest<UserRanking | null>(
      `/user/ranking?page=${page}?limit=${USER_RANKING_LIMIT}`,
      'GET'
    );
  }

};

export default userRequests;
