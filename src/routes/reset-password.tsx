import { createFileRoute } from '@tanstack/react-router';
import ResetPasswordPage from '@/pages/reset-password.tsx';
import { z } from 'zod';

const resetPasswordSearchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute('/reset-password')({
  component: RouteComponent,
  validateSearch: resetPasswordSearchSchema,
});

function RouteComponent() {
  const { token } = Route.useSearch();

  return <ResetPasswordPage token={token} />;
}
