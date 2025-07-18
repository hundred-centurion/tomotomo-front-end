import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import { type RegisterRequest } from '@/services/.api.ts';

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const res = await api.api.authRegisterCreate(data);
      if (!res.data?.success || !res.data.data) {
        throw new Error(res.data?.error || '로그인 실패');
      }
      return res.data.data;
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
