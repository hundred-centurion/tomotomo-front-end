import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import type { PdfDownloadLimitResponse } from '@/services/api.ts';

export function useAnalysisReportDownloadLimit() {
  return useQuery<PdfDownloadLimitResponse, Error>({
    queryKey: ['analysis-report', 'download-limit'],
    queryFn: async () => {
      const res = await api.api.timerAnalysisReportDownloadLimitList();

      if (!res.data?.success || !res.data.data) {
        throw new Error(res.data?.error || '다운로드 제한 조회 실패');
      }

      return res.data.data;
    },
  });
}
