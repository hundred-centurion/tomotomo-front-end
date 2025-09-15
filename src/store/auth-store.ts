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

    if (accessToken && refreshToken) {
      try {
        // JWT 토큰이 유효한지 확인
        const decodedToken = jwtDecode<JwtPayload>(accessToken);
        const currentTime = Date.now() / 1000;

        // 토큰이 만료되지 않았는지 확인
        if (decodedToken.exp && decodedToken.exp > currentTime) {
          api.setSecurityData(accessToken);
          set({
            accessToken,
            refreshToken,
            user: decodedToken as any, // 타입 캐스팅으로 임시 해결
            isAuthenticated: true,
          });
        } else {
          // 토큰이 만료된 경우 제거
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          api.setSecurityData(null);
          set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
        }
      } catch (error) {
        console.error('토큰 디코딩 실패:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        api.setSecurityData(null);
        set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
      }
    }
  },
}));
