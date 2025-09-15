import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupAxiosInterceptor } from '@/lib/axios.ts';
import { initializeAuth } from '@/services/auth.ts';
import { routeTree } from './routeTree.gen';
import '@/styles/globals.css';

const rootElement = document.getElementById('root')!;
const queryClient = new QueryClient();

export const router = createRouter({ routeTree });

// 인증 초기화 및 인터셉터 설정
console.log('🚀 앱 시작 - 인증 초기화 중...');
initializeAuth();
console.log('🔧 Axios 인터셉터 설정 중...');
setupAxiosInterceptor();
console.log('✅ 인증 초기화 및 인터셉터 설정 완료');

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
}
