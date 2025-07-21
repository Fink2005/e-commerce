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
      ? { name: '', email: '', password: '', confirmPassword: '' }
      : { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    setIsLoading(true);
    try {
      if (isRegister) {
        const registerData = data as RegisterFormData;
        const response = await authRequests.register({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
        });

        if (response && response.id) {
          // Store user data using createCookie
          await createCookie({
            name: 'authData',
            value: JSON.stringify({
              user: {
                id: response.id,
                name: response.name,
                email: response.email,
                created_at: response.created_at,
                updated_at: response.updated_at,
              },
            }),
            maxAge: 30 * 24 * 60 * 60, // 30 days
          });

          toast.success('Registration successful! Welcome to CheapDeals!');
          router.push('/login'); // Redirect to login after successful registration
        }
      } else {
        // Login logic remains the same
        const loginData = data as LoginFormData;
        const response = await authRequests.login({
          email: loginData.email,
          password: loginData.password,
        });

        if (response && response.accessToken) {
          // Store auth data using createCookie
          await createCookie({
            name: 'authData',
            value: JSON.stringify({
              user: {
                id: '',
                username: loginData.email,
                email: loginData.email,
              },
              accessToken: response.accessToken,
            }),
            maxAge: 3600, // 1 hour for access token
          });

          // Store refresh token separately
          await createCookie({
            name: 'refreshToken',
            value: response.refreshToken,
            maxAge: 7 * 24 * 60 * 60, // 7 days for refresh token
          });

          toast.success('Welcome back!');
          router.push('/');
        }
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
      } else if (error.message === 'Invalid credentials') {
        toast.error('Invalid email or password. Please try again.');
        form.setError('email', {
          type: 'manual',
          message: 'Invalid credentials',
        });
        form.setError('password', {
          type: 'manual',
          message: 'Invalid credentials',
        });
      } else if (error.message === 'User already exists') {
        toast.error('An account with this email already exists. Please use a different email or try logging in.');
        form.setError('email', {
          type: 'manual',
          message: 'User already exists',
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
              {/* Name Input - Only for Register */}
              {isRegister && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="name" className="sr-only">
                        Full Name
                      </Label>
                      <FormControl>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Full Name"
                          className="bg-gray-800/50 border-gray-600 p-4 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />
              )}

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
                              <Eye className="size-4" />
                            ) : (
                              <EyeOff className="size-4" />
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
                    <LoadingIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
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
                <GoogleIcon className="size-5" />
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
