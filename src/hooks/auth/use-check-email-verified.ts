import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';

export function useCheckEmailVerified() {
  return useQuery<boolean | undefined, Error>({
    queryKey: ['email-verified'],
    queryFn: async () => {
      const res = await api.api.authEmailVerifiedList();
      if (!res.data?.success) {
        throw new Error(res.data?.error || '이메일 인증 상태 확인 실패');
      }
      return res.data.data;
    },
    retry: false,
  });
}
