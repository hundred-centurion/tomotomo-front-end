import { createFileRoute, Outlet } from '@tanstack/react-router';
import TimerLayout from '@/components/layouts/timer-layout.tsx';

const RouteLayoutComponent = () => {
  return (
    <TimerLayout>
      <Outlet />
    </TimerLayout>
  );
};

export const Route = createFileRoute('/timer')({
  component: RouteLayoutComponent,
});
