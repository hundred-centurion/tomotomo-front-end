import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import type { PasswordResetConfirmRequest, ResponseEntityBaseResponseString } from '@/services/.api.ts';

export function usePasswordResetConfirm() {
  return useMutation<ResponseEntityBaseResponseString, Error, PasswordResetConfirmRequest>({
    mutationFn: async (data: PasswordResetConfirmRequest) => {
      const res = await api.api.authPasswordResetConfirmCreate(data);
      if (!res.data?.success) {
        throw new Error(res.data?.error || '비밀번호 재설정 확인 실패');
      }
      return res.data;
    },
    onError: (error) => {
      console.error('비밀번호 재설정 확인 오류:', error);
    },
  });
}
