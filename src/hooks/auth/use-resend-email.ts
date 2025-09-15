import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import type { ResponseEntityBaseResponseString } from '@/services/.api.ts';

export function useResendEmail() {
    return useMutation<ResponseEntityBaseResponseString, Error, string>({
        mutationFn: async (email: string) => {
            const res = await api.api.authResendEmailCreate({ email });
            if (!res.data?.success) {
                throw new Error(res.data?.error || '이메일 재전송 실패');
            }
            return res.data;
        },
        onError: (error) => {
            console.error('이메일 재전송 오류:', error);
        },
    });
}
