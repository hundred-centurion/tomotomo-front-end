import { Api } from '@/services/.api.ts';
import { useAuthStore } from '@/store/auth-store';

const API_BASE_URL = 'http://c100-backend.eba-bh5p77de.ap-northeast-2.elasticbeanstalk.com';

export const api = new Api({
  baseURL: API_BASE_URL,

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
