import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import type { ResponseEntityBaseResponseString } from '@/services/.api.ts';

export function useVerifyEmail() {
  return useMutation<ResponseEntityBaseResponseString, Error, string>({
    mutationFn: async (token: string) => {
      const res = await api.api.authVerifyEmailList({ token });
      if (!res.data?.success) {
        throw new Error(res.data?.error || '이메일 인증 실패');
      }
      return res.data;
    },
    onError: (error) => {
      console.error('이메일 인증 오류:', error);
    },
  });
}
