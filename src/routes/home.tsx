import { createFileRoute } from '@tanstack/react-router';
import HomePage from '@/pages/home.tsx';

export const Route = createFileRoute('/home')({
  component: RouteComponent,
});

function RouteComponent() {
  return <HomePage />;
}
