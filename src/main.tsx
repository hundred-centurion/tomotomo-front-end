import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupAxiosInterceptor } from '@/lib/axios.ts';
import { useAuthStore } from '@/store/auth-store.ts';
import { routeTree } from './routeTree.gen';
import '@/styles/globals.css';

const rootElement = document.getElementById('root')!;
const queryClient = new QueryClient();

export const router = createRouter({ routeTree });

setupAxiosInterceptor();
useAuthStore.getState().loadFromStorage();

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
