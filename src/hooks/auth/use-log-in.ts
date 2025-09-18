import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import { useAuthStore } from '@/store/auth-store.ts';
import { type LoginRequest, type LoginResponse } from '@/services/.api.ts';
import { toast } from 'sonner';

export function useLogIn() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (data: LoginRequest) => {
      try {
        const res = await api.api.authLoginCreate(data);
        if (!res.data?.success || !res.data.data) {
          // API 응답에서 에러 메시지가 있는 경우 해당 메시지 사용
          const errorMessage = res.data?.error || '로그인 실패';
          const error = new Error(errorMessage);
          // HTTP 상태 코드 정보 추가
          (error as any).status = res.status;
          throw error;
        }
        return res.data.data;
      } catch (error: any) {
        // HTTP 에러인 경우 상태 코드 정보 추가
        if (error.response?.status) {
          (error as any).status = error.response.status;
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      setAuth(data.accessToken!, data.refreshToken!);
    },
    onError: (error: any) => {
      // 401 에러인 경우 토스트 메시지 표시
      if (error.status === 401 || error.message.includes('401') || error.message.includes('Unauthorized')) {
        toast.error('존재하지 않는 계정입니다.');
      } else {
        toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    },
  });
}
