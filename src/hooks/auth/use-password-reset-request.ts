import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import type { PasswordResetRequest, ResponseEntityBaseResponseString } from '@/services/.api.ts';

export function usePasswordResetRequest() {
  return useMutation<ResponseEntityBaseResponseString, Error, PasswordResetRequest>({
    mutationFn: async (data: PasswordResetRequest) => {
      const res = await api.api.authPasswordResetRequestCreate(data);
      if (!res.data?.success) {
        throw new Error(res.data?.error || '비밀번호 재설정 요청 실패');
      }
      return res.data;
    },
    onError: (error) => {
      console.error('비밀번호 재설정 요청 오류:', error);
    },
  });
}
