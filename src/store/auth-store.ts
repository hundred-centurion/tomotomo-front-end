import { create } from 'zustand';
import { api } from '@/services/auth.ts';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (access: string, refresh: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  setAuth: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    api.setSecurityData(accessToken); // swagger API 인스턴스에도 반영
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    api.setSecurityData(null);
    set({ accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  loadFromStorage: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      api.setSecurityData(accessToken);
      set({ accessToken, refreshToken, isAuthenticated: true });
    }
  },
}));
