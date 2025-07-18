import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import { useAuthStore } from '@/store/auth-store.ts';
import { type LoginRequest } from '@/services/.api.ts';

export const useSignIn = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await api.api.authLoginCreate(data);
      if (!res.data?.success || !res.data.data) {
        throw new Error(res.data?.error || '로그인 실패');
      }
      return res.data.data;
    },
    onSuccess: (data) => {
      console.log(data);
      setAuth(data.accessToken!, data.refreshToken!);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
