'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createCookie } from '@/app/actions/cookie';
import authRequests from '@/app/apis/requests/auth';
import type { LoginFormData, RegisterFormData } from '@/app/schema/auth';
import { formatZodErrors, getValidationSchema } from '@/app/schema/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Eye from '@/utils/icons/Eye';
import EyeOff from '@/utils/icons/EyeOff';
import GoogleIcon from '@/utils/icons/GoogleIcon';
import LoadingIcon from '@/utils/icons/LoadingIcon';

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
  const [showPassword, setShowPassword] = useState<{
    original: boolean;
    confirm: boolean;
  }>({
    original: false,
    confirm: false,
  });
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
          // Store auth data using createCookie
          await createCookie({
            name: 'authData',
            value: JSON.stringify({
              user: response.user,
              accessToken: response.accessToken,
            }),
            maxAge: 3600,
          });

          // Store refresh token separately
          await createCookie({
            name: 'refreshToken',
            value: response.refreshToken,
            maxAge: 30 * 24 * 60 * 60,
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

  const togglePasswordVisibility = (type: 'original' | 'confirm') => {
    setShowPassword({
      ...showPassword,
      [type]: !showPassword[type]
    });
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
                          type={showPassword.original ? 'text' : 'password'}
                          placeholder="Password"
                          className="bg-gray-800/50 border-gray-600 p-4 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 pr-12"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-gray-400 hover:text-white"
                          onClick={() => togglePasswordVisibility('original')}
                        >
                          {showPassword.original ? (
                            <Eye />
                          ) : (
                            <EyeOff />
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
                            type={showPassword.confirm ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            className="bg-gray-800/50 border-gray-600 p-4 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 pr-12"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-gray-400 hover:text-white"
                            onClick={() => togglePasswordVisibility('confirm')}
                          >
                            {showPassword.confirm ? (
                              <Eye />
                            ) : (
                              <EyeOff />
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
                    <LoadingIcon />
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
                <GoogleIcon />
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
