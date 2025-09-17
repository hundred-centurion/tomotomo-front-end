import { createFileRoute } from '@tanstack/react-router';
import IndexPage from '@/pages';

export const Route = createFileRoute('/home')({
  component: RouteComponent,
});

function RouteComponent() {
  return <IndexPage />;
}
