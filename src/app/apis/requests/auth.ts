import apiRequest from '@/app/apis/apiRequest';
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from '@/types/auth';

const authRequests = {
  async login(body: LoginPayload): Promise<LoginResponse> {
    return await apiRequest<LoginResponse>('auth/login', 'POST', body);
  },

  async register(body: RegisterPayload): Promise<RegisterResponse> {
    return await apiRequest<RegisterResponse>('auth/register', 'POST', body);
  },
};

export default authRequests;
