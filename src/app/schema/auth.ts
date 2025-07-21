import z from 'zod';

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');

const emailOrPhoneSchema = z
  .string()
  .min(1, 'Email or phone number is required')
  .refine(
    (value) => {
      // Check if it's a valid email
      const emailResult = emailSchema.safeParse(value);
      if (emailResult.success) {
        return true;
      }

      // Check if it's a valid phone number
      const phoneResult = phoneSchema.safeParse(value);
      if (phoneResult.success) {
        return true;
      }

      return false;
    },
    {
      message: 'Please enter a valid email address or phone number'
    }
  );

const nameSchema = z.string().min(2, 'Name must be at least 2 characters');

// Login Schema
export const loginSchema = z.object({
  email: emailOrPhoneSchema,
  password: z
    .string()
    .min(1, 'Password is required')
});

// Registration Schema
export const registrationSchema = z.object({
  name: nameSchema,
  email: emailOrPhoneSchema,
  password: passwordSchema,
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password')
}).refine(
  data => data.password === data.confirmPassword,
  {
    message: 'Password doesn\'t match, please try again',
    path: ['confirmPassword']
  }
);

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  emailOrPhone: emailOrPhoneSchema
});

// Reset Password Schema
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password')
}).refine(
  data => data.password === data.confirmPassword,
  {
    message: 'Password doesn\'t match, please try again'
  }
);

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registrationSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const getValidationSchema = (mode: 'login' | 'register') => {
  return mode === 'login' ? loginSchema : registrationSchema;
};

export const validateAuthForm = (data: unknown, mode: 'login' | 'register') => {
  const schema = getValidationSchema(mode);
  return schema.safeParse(data);
};

// Error formatting helper
export const formatZodErrors = (error: any) => {
  const formattedErrors: Record<string, string> = {};

  if (error.errors) {
    error.errors.forEach((err: any) => {
      if (err.path && err.path.length > 0) {
        formattedErrors[err.path[0]] = err.message;
      }
    });
  }

  return formattedErrors;
};
