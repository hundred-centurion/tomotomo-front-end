import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import type { ResponseEntityBaseResponseMapObject } from '@/services/api.ts';

export function useValidateToken() {
  return useMutation<ResponseEntityBaseResponseMapObject, Error, string>({
    mutationFn: async (token: string) => {
      const res = await api.api.authValidateList({ token });
      if (!res.data?.success) {
        throw new Error(res.data?.error || '토큰 검증 실패');
      }
      return res.data;
    },
    onError: (error) => {
      console.error('토큰 검증 오류:', error);
    },
  });
}
