import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import type { ResponseEntityBaseResponseString } from '@/services/.api.ts';

export function useGenerateDummyData() {
    return useMutation<ResponseEntityBaseResponseString, Error, void>({
        mutationFn: async () => {
            const res = await api.api.adminGenerateDummyDataCreate();
            if (!res.data?.success) {
                throw new Error(res.data?.error || '더미 데이터 생성 실패');
            }
            return res.data;
        },
        onError: (error) => {
            console.error('더미 데이터 생성 오류:', error);
        },
    });
}
