import * as React from 'react';
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
    queryKey: ['timer-stats', 'monthly', y, m],
    queryFn: async () => {
      setStatsLoading(true);
      try {
        const res = await api.api.timerStatsMonthlyList({ year: y as number, month: m as number });
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

export function useAnalysisReportPdf(year: number | string, month: number | string) {
  let y = year;
  let m = month;

  if (typeof y === 'string') {
    y = parseInt(y, 10);
  }
  if (typeof m === 'string') {
    m = parseInt(m, 10);
  }

  return useQuery<number[], Error>({
    queryKey: ['analysis-report-pdf', y, m],
    queryFn: async () => {
      const res = await api.api.timerAnalysisReportPdfList({ year: y as number, month: m as number });
      return res.data;
    },
    enabled: !!y && !!m,
  });
}

export function useDownloadAnalysisReport() {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const downloadPdfFromBytes = async (bytes: number[], filename: string) => {
    try {
      // 바이트 배열을 Uint8Array로 변환
      const uint8Array = new Uint8Array(bytes);

      // Blob 생성
      const blob = new Blob([uint8Array], { type: 'application/pdf' });

      // 다운로드 링크 생성
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      // 다운로드 실행
      document.body.appendChild(link);
      link.click();

      // 정리
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF 다운로드 중 오류가 발생했습니다:', error);
      throw new Error('PDF 다운로드에 실패했습니다.');
    }
  };

  const downloadReport = async (year: number, month: number) => {
    setIsDownloading(true);
    try {
      const res = await api.api.timerAnalysisReportPdfList({ year, month });
      if (!res.data) {
        throw new Error('리포트 데이터를 받아올 수 없습니다.');
      }

      const filename = `공부리포트_${year}년_${month}월.pdf`;
      await downloadPdfFromBytes(res.data, filename);
    } catch (error) {
      console.error('리포트 다운로드 오류:', error);
      throw new Error('리포트 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadReport, isDownloading };
}
