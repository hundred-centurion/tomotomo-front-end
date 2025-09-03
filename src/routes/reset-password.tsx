import { createFileRoute } from '@tanstack/react-router';
import ResetPasswordPage from '@/pages/reset-password.tsx';

export const Route = createFileRoute('/reset-password')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ResetPasswordPage />;
}
