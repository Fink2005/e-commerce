'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createAuthCookies } from '@/app/actions/cookie';
import authRequests from '@/app/apis/requests/auth';
import type { LoginFormData, RegisterFormData } from '@/app/schema/auth';
import { formatZodErrors, getValidationSchema } from '@/app/schema/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthFormProps {
  mode: 'login' | 'register';
  onModeChange?: (mode: 'login' | 'register') => void;
}

export const testUsers = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    password: 'Password123', // In real app, this would be hashed
    roles: ['user'],
    isKyc: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'janedoe',
    email: 'jane.doe@example.com',
    phone: '+0987654321',
    password: 'SecurePass456',
    roles: ['user', 'admin'],
    isKyc: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'testuser',
    email: 'test@cheapdeals.com',
    phone: '+1122334455',
    password: 'TestPass789',
    roles: ['user'],
    isKyc: false,
    createdAt: new Date().toISOString(),
  }
];

export const generateAuthResponse = (user: typeof testUsers[0]) => ({
  user: {
    id: user.id,
    username: user.username,
    email: user.email,
  },
  accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIke3VzZXIuaWR9IiwiaWF0IjoxNzM0MjQwMDAwLCJleHAiOjE3MzQyNDM2MDB9.sample_access_token_${user.id}`,
  refreshToken: `refresh_token_sample_${user.id}_${Date.now()}`,
  expiresIn: 3600, // 1 hour
  tokenType: 'Bearer'
});

const AuthForm = ({ mode }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isLogin = mode === 'login';
  const isRegister = mode === 'register';

  const validationSchema = getValidationSchema(mode);

  const form = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: isRegister
      ? { email: '', password: '', confirmPassword: '' }
      : { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    setIsLoading(true);
    try {
      if (isRegister) {
        const registerData = data as RegisterFormData;
        const response = await authRequests.register({
          email: registerData.email,
          password: registerData.password,
          confirmPassword: registerData.confirmPassword,
        });

        if (response) {
          await createAuthCookies({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiresIn: response.expiresIn,
          });

          toast.success('Registration successful! Welcome to CheapDeals!');
          router.push('/');
        }
      } else {
        const loginData = data as LoginFormData;

        // Find user in test data by email or phone
        const user = testUsers.find(u =>
          u.email === loginData.email || u.phone === loginData.email
        );

        // Check if user exists and password matches
        if (user && user.password === loginData.password) {
        // Generate mock auth response

          toast.success('Welcome back!');
          // Redirect to home page (blank URL)
          router.push('/');
        } else {
        // Invalid credentials
          toast.error('Invalid email or password. Please try again.');
          form.setError('email', {
            type: 'manual',
            message: 'Invalid credentials',
          });
          form.setError('password', {
            type: 'manual',
            message: 'Invalid credentials',
          });
        }

        // Waiting for backend
        // const loginData = data as LoginFormData;
        // const response = await authRequests.login({
        //   email: loginData.email,
        //   password: loginData.password,
        // });

        // if (response?.result) {
        //   await createAuthCookies({
        //     user: response.result.user,
        //     accessToken: response.result.accessToken,
        //     refreshToken: response.result.refreshToken,
        //     expiresIn: response.result.expiresIn,
        //   });

        //   toast.success('Welcome back!');
        //   router.push('/');
        // }
      }
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const formattedErrors = formatZodErrors(error);
        Object.entries(formattedErrors).forEach(([field, message]) => {
          form.setError(field as keyof (LoginFormData | RegisterFormData), {
            type: 'manual',
            message,
          });
        });
      } else {
        toast.error(error.message || `${isRegister ? 'Registration' : 'Login'} failed. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/50 border-none backdrop-blur-sm font-inter">
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-medium text-white">
              {isLogin ? 'Log in to CheapDeals' : 'Create an account'}
            </h3>
            <p className="text-gray-400 text-base">
              Enter your details below
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email/Phone Input */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email" className="sr-only">
                      Email or Phone Number
                    </Label>
                    <FormControl>
                      <Input
                        id="email"
                        type="text"
                        placeholder="Email or Phone Number"
                        className="bg-gray-800/50 border-gray-600 p-4 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              {/* Password Input */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password" className="sr-only">
                      Password
                    </Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          className="bg-gray-800/50 border-gray-600 p-4 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 pr-12"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-gray-400 hover:text-white"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              {/* Confirm Password Input - Only for Register */}
              {isRegister && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="confirmPassword" className="sr-only">
                        Confirm Password
                      </Label>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            className="bg-gray-800/50 border-gray-600 p-4 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 pr-12"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-gray-400 hover:text-white"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {showConfirmPassword ? (
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                              </svg>
                            ) : (
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />
              )}

              {/* Forget Password Link - Only for Login */}
              {isLogin && (
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-gray-400 hover:text-white text-sm underline underline-offset-4 transition-colors"
                  >
                    Forget Password?
                  </Link>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? 'Logging in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLogin ? 'Log in' : 'Sign up'
                )}
              </Button>
            </form>
          </Form>

          {/* Google Auth Button - Only for Register */}
          {isRegister && (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black/50 px-2 text-gray-400">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700 hover:text-white py-3 rounded-md font-medium flex items-center justify-center gap-3 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </Button>
            </div>
          )}

          {/* Toggle Mode Link */}
          <div className="text-center text-gray-400">
            <span className="text-sm">
              {isLogin ? 'Doesn\'t have account? ' : 'Already have account? '}
            </span>
            <Link
              href={isLogin ? '/register' : '/login'}
              className="text-white text-sm underline underline-offset-4 transition-colors font-medium hover:text-gray-300"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
