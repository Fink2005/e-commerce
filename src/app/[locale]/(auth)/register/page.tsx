'use client';
import AuthForm from '@/components/AuthForm';
import { useState } from 'react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  const handleGoogleSignup = () => {
    console.log('Google signup clicked');
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center relative px-8 h-screen bg-login bg-gradient-to-br from-black via-gray-700 to-black via-50%">
      <div className="text-center text-white space-y-2">
        <h1 className="text-3xl font-bold font-inter">CheapDeals</h1>
        <p className="text-base font-poppins">Your shopping choice</p>
      </div>
      <AuthForm mode="register" />
    </div>
  );
};

export default RegisterPage;
