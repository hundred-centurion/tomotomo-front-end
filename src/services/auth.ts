import { Api } from '@/services/api.ts';
import { useAuthStore } from '@/store/auth-store';

const API_BASE_URL = 'https://www.we-tomotomo.com';

export const api = new Api({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5분 타임아웃 설정 (분석 리포트 생성에 충분한 시간)

  securityWorker: (securityData) => {
    if (!securityData) {
      return {};
    }

    return {
      headers: {
        Authorization: `Bearer ${securityData}`,
      },
    };
  },
});

export function syncApiToken() {
  const accessToken = useAuthStore.getState().accessToken;
  api.setSecurityData(accessToken);
}

// 앱 시작 시 토큰 동기화
export function initializeAuth() {
  const authStore = useAuthStore.getState();
  authStore.loadFromStorage();
  syncApiToken();
}
