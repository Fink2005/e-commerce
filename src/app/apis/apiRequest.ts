import { clearAuthCookies, createCookie, getCookie } from '@/app/actions/cookie';

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

    let response = await fetch(`https://e-commerce-be-9tqp.onrender.com/${endpoint}`, config);

    // Check if backend says token is expired (you can adjust the condition based on your backend response)
    if (!response.ok && response.status === 401 && accessToken && !endpoint.includes('auth/login') && !endpoint.includes('auth/register')) {
      try {
        const errorData = await response.json();

        // If backend indicates token is expired (adjust this condition based on your backend)
        if (errorData.isLogin === false || errorData.message?.includes('expired') || errorData.message?.includes('invalid token')) {
          const refreshToken = await getCookie('refreshToken');

          if (refreshToken) {
            // Try to refresh the token
            const refreshResponse = await fetch('https://e-commerce-be-9tqp.onrender.com/auth/refresh-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refreshToken }),
            });

            if (refreshResponse.ok) {
              const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshResponse.json();

              // Update cookies with new tokens
              const currentAuthData = await getCookie('authData');
              if (currentAuthData) {
                const parsedAuthData = JSON.parse(currentAuthData);
                parsedAuthData.accessToken = newAccessToken;

                await createCookie({
                  name: 'authData',
                  value: JSON.stringify(parsedAuthData),
                  maxAge: 15 * 60, // 15 minutes
                });
              }

              await createCookie({
                name: 'refreshToken',
                value: newRefreshToken,
                maxAge: 7 * 24 * 60 * 60, // 7 days
              });

              // Retry original request with new token
              config.headers.Authorization = `Bearer ${newAccessToken}`;
              response = await fetch(`https://e-commerce-be-9tqp.onrender.com/${endpoint}`, config);
            } else {
              // Refresh failed, clear cookies and throw error
              await clearAuthCookies();
              throw new Error('Session expired. Please login again.');
            }
          } else {
            // No refresh token, clear cookies and throw error
            await clearAuthCookies();
            throw new Error('Session expired. Please login again.');
          }
        } else {
          // Re-throw the original error if it's not about token expiration
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
      // eslint-disable-next-line unused-imports/no-unused-vars
      } catch (parseError) {
        // If we can't parse the error response, treat it as a general auth error
        const refreshToken = await getCookie('refreshToken');
        if (refreshToken) {
          // Try refresh anyway
          const refreshResponse = await fetch('https://e-commerce-be-9tqp.onrender.com/auth/refresh-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshResponse.json();

            const currentAuthData = await getCookie('authData');
            if (currentAuthData) {
              const parsedAuthData = JSON.parse(currentAuthData);
              parsedAuthData.accessToken = newAccessToken;

              await createCookie({
                name: 'authData',
                value: JSON.stringify(parsedAuthData),
                maxAge: 15 * 60,
              });
            }

            await createCookie({
              name: 'refreshToken',
              value: newRefreshToken,
              maxAge: 7 * 24 * 60 * 60,
            });

            config.headers.Authorization = `Bearer ${newAccessToken}`;
            response = await fetch(`https://e-commerce-be-9tqp.onrender.com/${endpoint}`, config);
          } else {
            await clearAuthCookies();
            throw new Error('Session expired. Please login again.');
          }
        } else {
          await clearAuthCookies();
          throw new Error('Session expired. Please login again.');
        }
      }
    }

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
