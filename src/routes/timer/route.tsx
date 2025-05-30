import { createFileRoute, Outlet } from '@tanstack/react-router';

function RouteLayoutComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export const Route = createFileRoute('/timer')({
  component: RouteLayoutComponent,
});
