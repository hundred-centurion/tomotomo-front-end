import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import { useTimerStore } from '@/store/timer-store.ts';
import type { TimerResponse } from '@/services/.api.ts';
import { GAEvents } from '@/lib/ga';

export function useTimerFocusRestart() {
    const queryClient = useQueryClient();
    const { updateTimerRecord, setStarting, setError } = useTimerStore();

    return useMutation<TimerResponse, Error, number>({
        mutationFn: async (timerId: number) => {
            setStarting(true);
            try {
                const res = await api.api.timerFocusStartCreate(timerId);
                if (!res.data?.success || !res.data.data) {
                    throw new Error(res.data?.error || '집중 타이머 재시작 실패');
                }
                updateTimerRecord(timerId, res.data.data);
                return res.data.data;
            } catch (error) {
                setError(error instanceof Error ? error.message : '알 수 없는 오류');
                throw error;
            } finally {
                setStarting(false);
            }
        },
        onSuccess: () => {
            GAEvents.startTimer('pomodoro');
            queryClient.invalidateQueries({ queryKey: ['timer-history'] });
            queryClient.invalidateQueries({ queryKey: ['timer-stats'] });
        },
    });
}
