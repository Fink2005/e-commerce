'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = () => {
    console.log('Login submitted:', formData);
  };

  return (
    <div className="w-full flex items-center justify-center p-4">
      <Card className="w-full bg-black/50 border-gray-700 backdrop-blur-sm">
        <CardContent className="space-y-6">
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold text-white">
              Log in to Exclusive
            </h3>
            <p className="text-gray-400 text-sm">
              Enter your details below
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailOrPhone" className="sr-only">
                Email or Phone Number
              </Label>
              <Input
                id="emailOrPhone"
                name="emailOrPhone"
                type="text"
                placeholder="Email or Phone Number"
                value={formData.emailOrPhone}
                onChange={handleInputChange}
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-gray-400 hover:text-white text-sm underline underline-offset-4 transition-colors"
              >
                Forget Password?
              </button>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-medium transition-colors"
            >
              Log in
            </Button>
          </div>

          <div className="text-center text-gray-400">
            <span className="text-sm">Doesn't have account? </span>
            <button
              type="button"
              className="text-white hover:text-gray-300 text-sm underline underline-offset-4 transition-colors font-medium"
            >
              Sign up
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
