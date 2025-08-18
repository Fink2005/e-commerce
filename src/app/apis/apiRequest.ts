import { getCookie } from '@/app/actions/cookie';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiRequestConfig {
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string;
  credentials: 'include';
}

export class ApiException extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
  }
}

const baseURL = typeof window === 'undefined'
  ? process.env.API_BASE_SERVER // server-side
  : process.env.NEXT_PUBLIC_API_BASE_CLIENT; // client-side

const apiRequest = async <T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  data: unknown = null,
  headers: Record<string, string> = {},
): Promise<T | null> => {
  try {
    const url = `${baseURL}/${endpoint}`;

    const config: ApiRequestConfig = {
      method,
      credentials: 'include', // Required to send/receive cookies
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    const accessToken = await getCookie('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);

    // Handle authentication errors
    if (!response.ok) {
      if (response.status === 422 || response.status === 401 || response.status === 403) {
        const errorData = await response.json();
        throw new ApiException(errorData.message || 'Request failed', response.status);
      }
      // Handle other HTTP errors
      throw new ApiException(`HTTP ${response.status}: ${response.statusText}`, response.status);
    }

    // Handle successful responses
    const contentType = response.headers.get('Content-Type');

    // Parse JSON response if content-type indicates JSON
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    const text = await response.text();
    return text ? (text as unknown as T) : null;
  } catch (error) {
    console.error(`❌ API request failed for ${endpoint}:`, (error as ApiException).message);
    throw error;
  }
};

export default apiRequest;
