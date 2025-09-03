import { createFileRoute } from '@tanstack/react-router';
import TodoPage from '@/pages/to-do.tsx';

export const Route = createFileRoute('/to-do')({
  component: RouteComponent,
});

function RouteComponent() {
  return <TodoPage />;
}
