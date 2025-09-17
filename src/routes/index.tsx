import { createFileRoute, Navigate } from '@tanstack/react-router';
import { HOME_PAGE } from '@/lib/pages.ts';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Navigate to={HOME_PAGE} />;
}
