import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import { useAuthStore } from '@/store/auth-store.ts';
import { type LoginRequest, type LoginResponse } from '@/services/.api.ts';

export function useSignIn() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation<LoginResponse, Error, LoginRequest>({
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
}
