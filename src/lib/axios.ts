import { api } from '@/services/auth.ts';
import { useAuthStore } from '@/store/auth-store.ts';

// 토큰 갱신 중인지 추적하는 플래그
let isRefreshing = false;
// 토큰 갱신 대기 중인 요청들을 저장하는 배열
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
  const axiosInstance = api.instance;
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
    (error) => Promise.reject(error),
  );

  // Response interceptor: 401 에러 시 토큰 갱신 및 재시도
  axiosInstance.interceptors.response.use(
    (response) => response, // 정상 응답은 그대로 반환
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;

      // 401 에러이고 아직 재시도하지 않은 요청인 경우
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // 이미 토큰 갱신 중이면 대기열에 추가
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              delete originalRequest._retry; // 재시도 플래그 제거
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        isRefreshing = true;
        const authStore = useAuthStore.getState();
        const refreshToken = authStore.refreshToken;

        if (!refreshToken) {
          isRefreshing = false;
          processQueue(error, null);
          api.setSecurityData(null);
          authStore.logout();
          return Promise.reject(error);
        }

        try {
          // refresh token을 Authorization 헤더에 설정하여 토큰 갱신 API 호출
          api.setSecurityData(refreshToken);

          const res = await api.api.authRefreshCreate({ refreshToken });

          if (res.data?.success && res.data?.data) {
            const { accessToken, refreshToken: newRefreshToken } = res.data.data;

            if (accessToken && newRefreshToken) {
              // 새로운 토큰을 저장소에 저장
              authStore.setAuth(accessToken, newRefreshToken);

              // API 인스턴스의 security data 업데이트
              api.setSecurityData(accessToken);

              // 원래 요청의 헤더 업데이트
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              delete originalRequest._retry; // 재시도 플래그 제거

              // 대기 중인 요청들 처리
              processQueue(null, accessToken);
              isRefreshing = false;

              // 원래 요청 재시도
              return axiosInstance(originalRequest);
            } else {
              throw new Error('토큰 갱신 응답에서 토큰 데이터 없음');
            }
          } else {
            throw new Error(res.data?.error || '토큰 갱신 실패');
          }
        } catch (refreshError) {
          console.error('토큰 갱신 실패:', refreshError);
          isRefreshing = false;
          processQueue(refreshError, null);
          api.setSecurityData(null);
          authStore.logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
}
