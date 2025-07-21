'use client';

import { clearAuthCookies, createCookie, getCookie } from '@/app/actions/cookie';
import authRequests from '@/app/apis/requests/auth';
import type { LoginFormData } from '@/app/schema/auth';
import type { User } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const checkAuthStatus = async () => {
    try {
      const authData = await getCookie('authData');
      if (authData) {
        const parsedData = JSON.parse(authData);
        setUser(parsedData.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  useEffect(() => {
    // Check if user is authenticated on mount
    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authRequests.login(credentials);

      if (response?.result) {
        const { accessToken, refreshToken, user } = response.result;

        // Store tokens in httpOnly cookies
        await createCookie({
          name: 'authData',
          value: JSON.stringify({ user, accessToken }),
          maxAge: 15 * 60, // 15 minutes for access token
        });

        await createCookie({
          name: 'refreshToken',
          value: refreshToken,
          maxAge: 7 * 24 * 60 * 60, // 7 days for refresh token
        });

        setUser(user);
        setIsAuthenticated(true);

        // Redirect based on user role or to home
        if (user.roles?.includes('admin')) {
          router.push('/admin');
        } else {
          router.push('/');
        }

        return { success: true, message: 'Login successful!' };
      } else {
        return {
          success: false,
          message: 'Invalid login credentials'
        };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await clearAuthCookies();
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
  };
}
