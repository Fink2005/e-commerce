import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

type AuthMode = 'login' | 'register';

const AuthForm = ({ mode = 'login' }) => {
  const isLogin: boolean = mode === 'login';
  const isRegister: boolean = mode === 'register';
  return (
    <div className="w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/50 border-none backdrop-blur-sm font-inter">
        <CardContent className="space-y-6">
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-medium text-white">
              {isLogin ? 'Log in to CheapDeals' : 'Create an account'}
            </h3>
            <p className="text-gray-400 text-base">
              Enter your details below
            </p>
          </div>

          <div className="space-y-4">
            {/* Email/Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="emailOrPhone" className="sr-only">
                Email or Phone Number
              </Label>
              <Input
                id="emailOrPhone"
                name="emailOrPhone"
                type="text"
                placeholder="Email or Phone Number"
                className="bg-gray-800/50 border-gray-600 p-4 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 disabled:opacity-50"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 disabled:opacity-50"
                required
              />
            </div>

            {/* Confirm Password Input - Only for Register */}
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 disabled:opacity-50"
                  required
                />
              </div>
            )}

            {/* Forget Password Link */}
            <div className="text-right">
              <button
                type="button"
                className="text-gray-400 hover:text-white text-sm underline underline-offset-4 transition-colors disabled:opacity-50"
              >
                Forget Password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {isLogin ? 'Log in' : 'Sign up'}
            </Button>
          </div>

          {/* Google Auth Button - Only for Register */}
          {isRegister && (
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700 hover:text-white py-3 rounded-md font-medium flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
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
              type="button"
              className="text-sm underline underline-offset-4 transition-colors font-medium disabled:opacity-50"
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
