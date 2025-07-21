type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiRequestConfig {
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string;
  credentials: 'include';
}

interface ApiError extends Error {
  message: string;
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

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);

    // Handle authentication errors
    if (!response.ok && response.status === 401) {
      // For auth endpoints, throw the error directly
      if (endpoint.includes('auth/login') || endpoint.includes('auth/register')) {
        let errorMessage = 'Authentication failed';

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If can't parse, use default message
        }

        throw new Error(errorMessage);
      }

      // For other endpoints, throw session expired error
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = await response.json();

        // Handle 422 validation errors (structured message array)
        if (response.status === 422 && errorData.message && Array.isArray(errorData.message)) {
          const firstError = errorData.message[0];
          errorMessage = firstError.message || errorData.error || errorMessage;
        } else if (response.status === 409) {
          // Handle 409 conflict
          errorMessage = errorData.message || 'User already exists';
        } else if (errorData.message && typeof errorData.message === 'string') {
          // Handle other errors with message field
          errorMessage = errorData.message;
        } else if (errorData.error && typeof errorData.error === 'string') {
          // Handle errors with error field
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        // If response is not JSON, use default error message
        console.error('Failed to parse error response:', parseError);
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
    console.error(`❌ API request failed for ${endpoint}:`, (error as ApiError).message);
    throw error;
  }
};

export default apiRequest;
