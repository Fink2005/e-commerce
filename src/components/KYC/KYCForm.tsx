'use client';
import type { KYCFormData } from '@/app/schema/kyc';
import { KYCSchema } from '@/app/schema/kyc';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const KYCForm = () => {
  const form = useForm<KYCFormData>({
    resolver: zodResolver(KYCSchema),
    defaultValues: {
      email: '',
      citizenId: '',
    },
  });
  const router = useRouter();

  const onSubmit = async (data: KYCFormData) => {
    try {
      // Simulate API call
      // eslint-disable-next-line no-console
      console.log('Form submitted:', data);
      router.push('/verify-email');
    } catch {
      toast.error('Lỗi khi gửi biểu mẫu. Vui lòng thử lại sau.');
    }
    form.reset();
  };

  return (
    <div className="p-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-white">
                  Email
                </FormLabel>
                <FormControl>
                  <Input className="input-kyc" placeholder="Nhập email của bạn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="citizenId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-white">
                  CCCD
                </FormLabel>
                <FormControl>
                  <Input type="number" className="input-kyc" placeholder="Nhập căn cước công dân của bạn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full button-base" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xác nhận...
              </>
            ) : (
              'Xác nhận'
            )}
          </Button>
        </form>
      </Form>
    </div>

  );
};

export default KYCForm;
