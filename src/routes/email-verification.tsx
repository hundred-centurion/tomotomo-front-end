import { createFileRoute } from '@tanstack/react-router';
import EmailVerificationPage from '@/pages/email-verification.tsx';
import EmailVerificationReadyPage from '@/pages/email-verification-ready.tsx';
import EmailVerificationDonePage from '@/pages/email-verification-done.tsx';
import type { FileRouteTypes } from '@/routeTree.gen.ts';

export type EmailVerificationPageSearchQuery = {
  type?: 'ready' | 'done';
  email?: string;
  from?: FileRouteTypes['to'];
  token?: string;
};

export const Route = createFileRoute('/email-verification')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): EmailVerificationPageSearchQuery => {
    return {
      type: search?.type ?? '',
      email: search?.email ?? '',
      from: search?.from ?? '',
      token: search?.token ?? '',
    } as EmailVerificationPageSearchQuery;
  },
});

function RouteComponent() {
  const { type, email, from, token } = Route.useSearch();

  if (type === 'ready') {
    return <EmailVerificationReadyPage email={email} from={from} />;
  }
  if (type === 'done') {
    return <EmailVerificationDonePage email={email} from={from} token={token} />;
  }
  return <EmailVerificationPage from={from} />;
}
