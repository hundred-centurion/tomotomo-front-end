import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import { useAuthStore } from '@/store/auth-store.ts';
import type { RefreshTokenRequest, LoginResponse } from '@/services/.api.ts';

export function useRefreshToken() {
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation<LoginResponse, Error, RefreshTokenRequest>({
        mutationFn: async (data: RefreshTokenRequest) => {
            const res = await api.api.authRefreshCreate(data);
            if (!res.data?.success || !res.data.data) {
                throw new Error(res.data?.error || '토큰 갱신 실패');
            }
            return res.data.data;
        },
        onSuccess: (data) => {
            setAuth(data.accessToken!, data.refreshToken!);
        },
        onError: (error) => {
            console.error('토큰 갱신 오류:', error);
        },
    });
}
