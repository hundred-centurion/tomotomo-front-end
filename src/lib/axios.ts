import { api } from '@/services/auth.ts';
import { useAuthStore } from '@/store/auth-store.ts';

// 토큰 갱신 중인지 추적하는 플래그
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

// 대기 중인 요청들을 처리하는 함수
function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
}

export function setupAxiosInterceptor() {
  const axiosInstance = api.instance; // swagger-typescript-api가 내부적으로 사용하는 axios 인스턴스

  // Request interceptor: 모든 요청에 Authorization 헤더 자동 추가
  axiosInstance.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore.getState();
      const accessToken = authStore.accessToken;

      if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: 401 에러 시 토큰 갱신 및 재시도
  axiosInstance.interceptors.response.use(
    (res) => res, // 정상 응답
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;

      if (status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // 이미 토큰 갱신 중이면 대기열에 추가
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          }).catch((err) => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        console.log('401 발생 → RefreshToken 시도');

        const authStore = useAuthStore.getState();
        const refreshToken = authStore.refreshToken;

        if (!refreshToken) {
          console.log('RefreshToken이 없음 → 로그아웃');
          isRefreshing = false;
          processQueue(error, null);
          authStore.logout();
          return Promise.reject(error);
        }

        try {
          // refresh token을 Authorization 헤더에 설정하여 API 호출
          // 기존 API 인스턴스의 security data를 refresh token으로 임시 변경
          const currentAccessToken = authStore.accessToken;
          api.setSecurityData(refreshToken);

          const res = await api.api.authRefreshCreate({ refreshToken });

          // 원래 access token으로 security data 복원
          api.setSecurityData(currentAccessToken);

          // 응답 구조 확인 및 데이터 추출
          if (res.data?.success && res.data?.data) {
            const { accessToken, refreshToken: newRefreshToken } = res.data.data;

            if (accessToken && newRefreshToken) {
              console.log('토큰 갱신 성공');
              authStore.setAuth(accessToken, newRefreshToken);

              // 새 토큰으로 원래 요청 다시 시도
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;

              // 대기 중인 요청들 처리
              processQueue(null, accessToken);
              isRefreshing = false;

              return axiosInstance(originalRequest);
            } else {
              console.log('토큰 갱신 응답에서 토큰 데이터 없음 → 로그아웃');
              isRefreshing = false;
              processQueue(error, null);
              authStore.logout();
            }
          } else {
            console.log('토큰 갱신 실패:', res.data?.error || '알 수 없는 오류');
            isRefreshing = false;
            processQueue(error, null);
            authStore.logout();
          }
        } catch (err) {
          console.error('Refresh API 호출 실패:', err);
          isRefreshing = false;
          processQueue(err, null);
          authStore.logout();
        }
      }

      return Promise.reject(error);
    },
  );
}
