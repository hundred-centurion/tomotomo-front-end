import { createFileRoute } from '@tanstack/react-router';
import SignUpPage from '@/pages/sign-up.tsx';
import SignUpDonePage from '@/pages/sign-up-done.tsx';

export type SignUpPageSearchQuery = {
  type?: 'ready' | 'done';
  email?: string;
  nickName?: string;
};

export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): SignUpPageSearchQuery => {
    return {
      type: search?.type ?? 'ready',
      email: search?.email ?? '',
      nickName: search?.nickName ?? '',
    } as SignUpPageSearchQuery;
  },
});

function RouteComponent() {
  const { type, email, nickName } = Route.useSearch();

  if (type === 'ready') {
    return <SignUpPage email={email} />;
  }
  return <SignUpDonePage nickName={nickName} />;
}
