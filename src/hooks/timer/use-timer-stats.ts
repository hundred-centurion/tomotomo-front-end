import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import { useTimerStore } from '@/store/timer-store.ts';
import type { MonthlyStatsResponse, UserAnalysisReportResponse, TimerDashboardStatsResponse } from '@/services/.api.ts';

export function useTimerStats() {
  const { setTimerStats, setStatsLoading, setError } = useTimerStore();

  return useQuery<TimerDashboardStatsResponse, Error>({
    queryKey: ['timer-stats'],
    queryFn: async () => {
      setStatsLoading(true);
      try {
        const res = await api.api.timerStatsList();
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || '타이머 통계 조회 실패');
        }
        setTimerStats(res.data.data);
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setStatsLoading(false);
      }
    },
  });
}

export function useMonthlyStats(year: number | string, month: number | string) {
  let y = year;
  let m = month;
  const { setMonthlyStats, setStatsLoading, setError } = useTimerStore();

  if (typeof y === 'string') {
    y = parseInt(y, 10);
  }
  if (typeof m === 'string') {
    m = parseInt(m, 10);
  }

  return useQuery<MonthlyStatsResponse, Error>({
    queryKey: ['timer-stats', 'monthly', year, month],
    queryFn: async () => {
      setStatsLoading(true);
      try {
        const res = await api.api.timerStatsMonthlyList({ year: y, month: m });
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || '월별 타이머 통계 조회 실패');
        }
        setMonthlyStats(res.data.data);
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setStatsLoading(false);
      }
    },
    enabled: !!year && !!month,
  });
}

export function useTimerFeedback() {
  return useQuery<string | undefined, Error>({
    queryKey: ['timer-feedback'],
    queryFn: async () => {
      const res = await api.api.timerStatsFeedbackList();
      if (!res.data?.success) {
        throw new Error(res.data?.error || 'AI 피드백 조회 실패');
      }
      return res.data.data;
    },
  });
}

export function useAnalysisReport(year: number, month: number) {
  const { setAnalysisReport, setStatsLoading, setError } = useTimerStore();

  return useQuery<UserAnalysisReportResponse, Error>({
    queryKey: ['analysis-report', year, month],
    queryFn: async () => {
      setStatsLoading(true);
      try {
        const res = await api.api.timerAnalysisReportList({ year, month });
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || 'AI 분석 리포트 조회 실패');
        }
        setAnalysisReport(res.data.data);
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setStatsLoading(false);
      }
    },
    enabled: !!year && !!month,
  });
}

export function useAnalysisReportPdf(year: number, month: number) {
  return useQuery<number[], Error>({
    queryKey: ['analysis-report-pdf', year, month],
    queryFn: async () => {
      const res = await api.api.timerAnalysisReportPdfList({ year, month });
      return res.data;
    },
    enabled: !!year && !!month,
  });
}
