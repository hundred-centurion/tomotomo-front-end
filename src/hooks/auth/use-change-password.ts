import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import type {
    UpdatePasswordRequest,
    VerifyPasswordRequest,
    ResponseEntityBaseResponseString,
    ResponseEntityBaseResponseBoolean
} from '@/services/.api.ts';

export function useVerifyPassword() {
    return useMutation<ResponseEntityBaseResponseBoolean, Error, VerifyPasswordRequest>({
        mutationFn: async (data: VerifyPasswordRequest) => {
            const res = await api.api.passwordVerifyCreate(data);
            if (!res.data?.success) {
                throw new Error(res.data?.error || '비밀번호 확인 실패');
            }
            return res.data;
        },
        onError: (error) => {
            console.error('비밀번호 확인 오류:', error);
        },
    });
}

export function useChangePassword() {
    return useMutation<ResponseEntityBaseResponseString, Error, UpdatePasswordRequest>({
        mutationFn: async (data: UpdatePasswordRequest) => {
            const res = await api.api.passwordUpdateCreate(data);
            if (!res.data?.success) {
                throw new Error(res.data?.error || '비밀번호 변경 실패');
            }
            return res.data;
        },
        onError: (error) => {
            console.error('비밀번호 변경 오류:', error);
        },
    });
}
