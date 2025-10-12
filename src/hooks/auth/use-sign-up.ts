import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import type { RegisterRequest, MemberDto } from '@/services/.api.ts';
import { toast } from 'sonner';

export function useSignUp() {
  return useMutation<MemberDto, Error, RegisterRequest>({
    mutationFn: async (data: RegisterRequest) => {
      try {
        const res = await api.api.authRegisterCreate(data);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || '회원가입 실패');
        }
        return res.data.data;
      } catch (error: unknown) {
        // 409 상태 코드 (중복 이메일) 처리
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 409) {
            toast.error('이미 사용 중인 이메일입니다.');
            throw new Error('중복 이메일');
          }
        }
        throw error;
      }
    },
    onError: (error) => {
      console.error('회원가입 오류:', error);
    },
  });
}
