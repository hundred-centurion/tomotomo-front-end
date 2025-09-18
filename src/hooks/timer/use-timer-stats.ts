import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import { useTimerStore } from '@/store/timer-store.ts';
import type {
  UserAnalysisReportResponse,
  TimerDashboardStatsResponse,
  MonthlyDashboardStatsResponse,
} from '@/services/.api.ts';

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

  return useQuery<MonthlyDashboardStatsResponse, Error>({
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
  const { isDownloading, setDownloading } = useTimerStore();

  const getBlobFirstBytes = async (blob: Blob) => {
    const arrayBuffer = await blob.slice(0, 10).arrayBuffer();
    return Array.from(new Uint8Array(arrayBuffer));
  };

  const downloadPdfFromBytes = async (bytes: number[], filename: string) => {
    try {
      // 데이터 검증
      if (!bytes || bytes.length === 0) {
        throw new Error('PDF 데이터가 비어있습니다.');
      }

      console.log('PDF 다운로드 데이터:', {
        bytesLength: bytes.length,
        firstFewBytes: bytes.slice(0, 10),
        lastFewBytes: bytes.slice(-10)
      });

      // 바이트 배열을 Uint8Array로 변환
      const uint8Array = new Uint8Array(bytes);

      // Blob 생성 - PDF 타입으로 수정
      const blob = new Blob([uint8Array], { type: 'application/pdf' });

      console.log('생성된 Blob:', {
        size: blob.size,
        type: blob.type
      });

      // Blob 크기 검증
      if (blob.size === 0) {
        throw new Error('생성된 PDF 파일이 비어있습니다.');
      }

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
    setDownloading(true);
    try {
      console.log('PDF 다운로드 요청 시작:', { year, month });

      const res = await api.api.timerAnalysisReportPdfList({ year, month }, {
        format: 'arraybuffer' // PDF 바이너리 데이터를 위해 arraybuffer로 설정
      });

      console.log('API 응답:', {
        status: res.status,
        statusText: res.statusText,
        data: res.data,
        dataType: typeof res.data,
        dataLength: Array.isArray(res.data) ? res.data.length : 'not array',
        headers: res.headers,
        contentType: res.headers['content-type'],
        contentLength: res.headers['content-length']
      });

      if (!res.data) {
        throw new Error('리포트 데이터를 받아올 수 없습니다.');
      }

      const filename = `공부리포트_${year}년_${month}월.pdf`;

      // Case 1: 데이터가 ArrayBuffer인 경우 (PDF 바이너리)
      if (res.data instanceof ArrayBuffer) {
        console.log('ArrayBuffer 데이터:', {
          byteLength: res.data.byteLength,
          firstFewBytes: new Uint8Array(res.data.slice(0, 10))
        });

        const blob = new Blob([res.data], { type: 'application/pdf' });

        console.log('생성된 Blob:', {
          size: blob.size,
          type: blob.type
        });

        if (blob.size === 0) {
          throw new Error('생성된 PDF 파일이 비어있습니다.');
        }

        // 직접 다운로드
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      // Case 2: 데이터가 Blob인 경우
      else if (res.data instanceof Blob) {
        console.log('Blob 데이터:', {
          size: res.data.size,
          type: res.data.type,
          firstFewBytes: await getBlobFirstBytes(res.data)
        });

        if (res.data.size === 0) {
          throw new Error('PDF 데이터가 비어있습니다.');
        }

        // Blob 타입이 올바르지 않은 경우 수정
        const pdfBlob = res.data.type === 'application/pdf'
          ? res.data
          : new Blob([res.data], { type: 'application/pdf' });

        console.log('최종 PDF Blob:', {
          size: pdfBlob.size,
          type: pdfBlob.type
        });

        // 직접 다운로드
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      // Case 3: 데이터가 number[] 배열인 경우 (현재 API 스펙)
      else if (Array.isArray(res.data)) {
        if (res.data.length === 0) {
          throw new Error('PDF 데이터가 비어있습니다.');
        }
        await downloadPdfFromBytes(res.data, filename);
      }
      // Case 4: 기타 경우
      else {
        console.error('예상치 못한 데이터 형식:', res.data);
        throw new Error('서버에서 지원하지 않는 형식의 데이터를 반환했습니다.');
      }

      console.log('PDF 다운로드 완료:', filename);
    } catch (error) {
      console.error('리포트 다운로드 오류:', error);
      throw new Error('리포트 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setDownloading(false);
    }
  };

  return { downloadReport, isDownloading };
}
