import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import { useAuthStore } from '@/store/auth-store.ts';
import { useNavigate } from '@tanstack/react-router';
import type { ResponseEntityBaseResponseString } from '@/services/api.ts';
import { LOG_IN_PAGE } from '@/lib/pages.ts';

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return useMutation<ResponseEntityBaseResponseString, Error, void>({
    mutationFn: async () => {
      const res = await api.api.authLogoutCreate();
      if (!res.data?.success) {
        throw new Error(res.data?.error || '로그아웃 실패');
      }
      return res.data;
    },
    onSuccess: () => {
      logout();
      // 로그아웃 후 log-in 페이지로 명시적 이동
      navigate({ to: LOG_IN_PAGE });
    },
    onError: (error) => {
      console.error('로그아웃 오류:', error);
      // 오류가 발생해도 로컬에서 로그아웃 처리
      logout();
      navigate({ to: LOG_IN_PAGE });
    },
  });
}
