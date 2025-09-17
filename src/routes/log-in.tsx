import { createFileRoute } from '@tanstack/react-router';
import LogInPage from '@/pages/log-in.tsx';

export const Route = createFileRoute('/log-in')({
  component: RouteComponent,
});

function RouteComponent() {
  return <LogInPage />;
}
