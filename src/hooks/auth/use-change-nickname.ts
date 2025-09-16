import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import type { NicknameChangeRequest, MemberDto } from '@/services/.api.ts';

export function useChangeNickname() {
  return useMutation<MemberDto, Error, NicknameChangeRequest>({
    mutationFn: async (data: NicknameChangeRequest) => {
      const res = await api.api.authNicknameCreate(data);
      if (!res.data?.success || !res.data.data) {
        throw new Error(res.data?.error || '닉네임 변경 실패');
      }
      return res.data.data;
    },
    onError: (error) => {
      console.error('닉네임 변경 오류:', error);
    },
  });
}
