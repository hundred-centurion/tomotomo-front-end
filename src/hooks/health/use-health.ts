import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import type { Key } from '@/services/.api.ts';

export function useHealthCheck() {
  return useQuery<Key, Error>({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await api.health.healthList();
      return res.data;
    },
    retry: 3,
    retryDelay: 1000,
    refetchInterval: 30000, // 30초마다 체크
  });
}
