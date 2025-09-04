import { createFileRoute } from '@tanstack/react-router';
import EmailVerificationPage from '@/pages/email-verification.tsx';
import EmailVerificationReadyPage from '@/pages/email-verification-ready.tsx';
import type { FileRouteTypes } from '@/routeTree.gen.ts';

export type EmailVerificationPageSearchQuery = {
  type?: 'ready' | 'done';
  email?: string;
  from?: FileRouteTypes['to'];
};

export const Route = createFileRoute('/email-verification')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): EmailVerificationPageSearchQuery => {
    return {
      type: search?.type ?? '',
      email: search?.email ?? '',
    } as EmailVerificationPageSearchQuery;
  },
});

function RouteComponent() {
  const { type, email, from } = Route.useSearch();

  if (type === 'ready') {
    return <EmailVerificationReadyPage email={email} from={from} />;
  }
  return <EmailVerificationPage from={from} />;
}
