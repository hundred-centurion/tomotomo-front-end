import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import BaseLayout from '@/components/layouts/base-layout.tsx';

export const Route = createRootRoute({
  component: () => (
    <BaseLayout>
      <Outlet />
      <TanStackRouterDevtools />
    </BaseLayout>
  ),
});
