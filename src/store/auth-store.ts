import { create } from 'zustand';
import { api } from '@/services/auth.ts';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from 'jwt-decode';

type AuthState = {
  user: {
    iat: number;
    exp: number;
    userEmail: string;
    userName: string;
    sub: string;
    emailVerified: boolean;
    roles: string[];
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (access: string, refresh: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  setAuth(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    api.setSecurityData(accessToken); // swagger API 인스턴스에도 반영
    set({ accessToken, refreshToken, user: jwtDecode(accessToken), isAuthenticated: true });
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    api.setSecurityData(null);
    set({ accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  loadFromStorage() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    console.log('📦 토큰 로드 시도:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken
    });

    if (accessToken && refreshToken) {
      try {
        // JWT 토큰이 유효한지 확인
        const decodedToken = jwtDecode<JwtPayload>(accessToken);
        const currentTime = Date.now() / 1000;

        // 토큰이 만료되지 않았는지 확인
        if (decodedToken.exp && decodedToken.exp > currentTime) {
          console.log('✅ 유효한 토큰 발견 - 인증 완료');
          api.setSecurityData(accessToken);
          set({
            accessToken,
            refreshToken,
            user: decodedToken as any, // 타입 캐스팅으로 임시 해결
            isAuthenticated: true,
          });
        } else {
          console.log('⏰ 토큰 만료 - refresh token 유지');
          // 토큰이 만료된 경우 access token만 제거하고 refresh token은 유지
          localStorage.removeItem('accessToken');
          api.setSecurityData(null);
          set({
            accessToken: null,
            refreshToken, // refresh token은 유지
            user: null,
            isAuthenticated: false
          });
        }
      } catch (error) {
        console.error('토큰 디코딩 실패:', error);
        localStorage.removeItem('accessToken');
        api.setSecurityData(null);
        set({
          accessToken: null,
          refreshToken, // refresh token은 유지
          user: null,
          isAuthenticated: false
        });
      }
    }
  },
}));
