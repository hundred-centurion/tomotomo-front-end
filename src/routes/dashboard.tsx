import { createFileRoute } from '@tanstack/react-router';

const DashboardPage = () => {
  return <div>Hello "/dashboard"!</div>;
};

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});
