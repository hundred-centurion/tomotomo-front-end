import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import type { RegisterRequest, MemberDto } from '@/services/.api.ts';

export function useSignUp() {
  return useMutation<MemberDto, Error, RegisterRequest>({
    mutationFn: async (data: RegisterRequest) => {
      const res = await api.api.authRegisterCreate(data);
      if (!res.data?.success || !res.data.data) {
        throw new Error(res.data?.error || '회원가입 실패');
      }
      return res.data.data;
    },
    onError: (error) => {
      console.error('회원가입 오류:', error);
    },
  });
}