import { createFileRoute } from '@tanstack/react-router';
import TasksPage from '@/pages/tasks.tsx';

export const Route = createFileRoute('/tasks')({
  component: RouteComponent,
});

function RouteComponent() {
  return <TasksPage />;
}
