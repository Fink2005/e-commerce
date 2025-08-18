/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
// @ts-nocheck

// Disable eslint

import { productRequests } from '@/app/apis/requests/product';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateProduct = () => {
  return useMutation<any, Error, any>({
    mutationFn: async (data: any) => {
      const response = await productRequests.createProduct(data);
      if (!response) {
        throw new Error('Failed to create product');
      }
      return response;
    },
    onError: (error) => {
      if (error instanceof ApiException) {
        toast.error(error.message)
      } 
    }
  });
};
