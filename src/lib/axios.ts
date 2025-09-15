import { api } from '@/services/auth.ts';
import { useAuthStore } from '@/store/auth-store.ts';

export function setupAxiosInterceptor() {
  const axiosInstance = api.instance; // swagger-typescript-api가 내부적으로 사용하는 axios 인스턴스

  axiosInstance.interceptors.response.use(
    (res) => res, // 정상 응답
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;

      if (status === 401 && !originalRequest._retry) {
        console.log('401 발생 → RefreshToken 시도');
        originalRequest._retry = true; // 무한 루프 방지

        const authStore = useAuthStore.getState();
        const refreshToken = authStore.refreshToken;

        if (!refreshToken) {
          console.log('RefreshToken이 없음 → 로그아웃');
          authStore.logout();
          return Promise.reject(error);
        }

        try {
          const res = await api.api.authRefreshCreate({ refreshToken });
          const data = res.data?.data;

          if (data?.accessToken && data?.refreshToken) {
            console.log('토큰 갱신 성공');
            authStore.setAuth(data.accessToken, data.refreshToken);

            // 새 토큰으로 요청 다시 시도
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return axiosInstance(originalRequest);
          } else {
            console.log('토큰 갱신 응답 데이터 없음 → 로그아웃');
            authStore.logout();
          }
        } catch (err) {
          console.error('Refresh 실패', err);
          authStore.logout();
        }
      }

      return Promise.reject(error);
    },
  );
}
