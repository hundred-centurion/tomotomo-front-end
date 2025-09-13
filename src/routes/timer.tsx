import { createFileRoute } from '@tanstack/react-router';
import TimerPage from '@/pages/timer.tsx';

export const Route = createFileRoute('/timer')({
  component: RouteComponent,
});

function RouteComponent() {
  return <TimerPage />;
}
