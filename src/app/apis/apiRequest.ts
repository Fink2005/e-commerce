import { getCookie } from '@/app/actions/cookie';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiRequestConfig {
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string;
}

interface ApiError extends Error {
  message: string;
}

const apiRequest = async <T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  data: unknown = null,
  headers: Record<string, string> = {},
): Promise<T | null> => {
  try {
    const authData = await getCookie('authData');
    const accessToken = authData ? JSON.parse(authData)?.accessToken : undefined;
    const config: ApiRequestConfig = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...headers,
      },
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`https://e-commerce-be-9tqp.onrender.com/${endpoint}`, config);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use default error message
      }

      const error = new Error(errorMessage) as ApiError;
      throw error;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return (await response.json()) as T;
    }

    // Handle non-JSON responses
    return null;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, (error as ApiError).message);
    throw error;
  }
};

export default apiRequest;
