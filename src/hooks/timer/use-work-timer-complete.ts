import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import { useTimerStore } from '@/store/timer-store.ts';
import type { TimerCompleteRequest, TimerResponse } from '@/services/.api.ts';

export function useWorkTimerComplete() {
    const queryClient = useQueryClient();
    const { updateTimerRecord, setCompleting, setError } = useTimerStore();

    return useMutation<TimerResponse, Error, { timerId: number; data: TimerCompleteRequest }>({
        mutationFn: async ({ timerId, data }: { timerId: number; data: TimerCompleteRequest }) => {
            setCompleting(true);
            try {
                const res = await api.api.timerCompleteCreate(timerId, data);
                if (!res.data?.success || !res.data.data) {
                    throw new Error(res.data?.error || '집중 타이머 완료 처리 실패');
                }
                updateTimerRecord(timerId, res.data.data);
                return res.data.data;
            } catch (error) {
                setError(error instanceof Error ? error.message : '알 수 없는 오류');
                throw error;
            } finally {
                setCompleting(false);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timer-history'] });
            queryClient.invalidateQueries({ queryKey: ['timer-stats'] });
        },
    });
}
