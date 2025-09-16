import { useMutation } from '@tanstack/react-query';
// import { api } from '@/services/auth.ts';
import type { ResponseEntityBaseResponseString } from '@/services/.api.ts';

interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export function useChangePassword() {
    return useMutation<ResponseEntityBaseResponseString, Error, ChangePasswordRequest>({
        mutationFn: async (_data: ChangePasswordRequest) => {
            // TODO: 실제 API 엔드포인트가 구현되면 교체
            // const res = await api.api.authPasswordChangeCreate(data);

            // 임시로 성공 응답 시뮬레이션
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        data: '비밀번호가 성공적으로 변경되었습니다.',
                        code: 'SUCCESS',
                        error: undefined
                    });
                }, 1000);
            });
        },
        onError: (error) => {
            console.error('비밀번호 변경 오류:', error);
        },
    });
}
