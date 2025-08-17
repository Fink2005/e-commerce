import apiRequest from '@/app/apis/apiRequest';

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
  }
};

export default userRequests;
