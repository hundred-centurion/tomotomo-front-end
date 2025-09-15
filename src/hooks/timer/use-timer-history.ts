import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import { useTimerStore } from '@/store/timer-store.ts';
import type { TimerResponse } from '@/services/.api.ts';

export function useTimerHistory() {
    const { setTimerHistory, setLoading, setError } = useTimerStore();

    return useQuery<TimerResponse[], Error>({
        queryKey: ['timer-history'],
        queryFn: async () => {
            setLoading(true);
            try {
                const res = await api.api.timerHistoryList();
                if (!res.data?.success || !res.data.data) {
                    throw new Error(res.data?.error || '타이머 기록 조회 실패');
                }
                setTimerHistory(res.data.data);
                return res.data.data;
            } catch (error) {
                setError(error instanceof Error ? error.message : '알 수 없는 오류');
                throw error;
            } finally {
                setLoading(false);
            }
        },
    });
}

export function useTimerHistoryByDateRange(startDate: string, endDate: string) {
    const { setTimerHistory, setLoading, setError } = useTimerStore();

    return useQuery<TimerResponse[], Error>({
        queryKey: ['timer-history', 'date-range', startDate, endDate],
        queryFn: async () => {
            setLoading(true);
            try {
                const res = await api.api.timerHistoryDateRangeList({
                    startDate,
                    endDate,
                });
                if (!res.data?.success || !res.data.data) {
                    throw new Error(res.data?.error || '기간별 타이머 기록 조회 실패');
                }
                setTimerHistory(res.data.data);
                return res.data.data;
            } catch (error) {
                setError(error instanceof Error ? error.message : '알 수 없는 오류');
                throw error;
            } finally {
                setLoading(false);
            }
        },
        enabled: !!startDate && !!endDate,
    });
}
