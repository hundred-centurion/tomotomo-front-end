import { createFileRoute } from '@tanstack/react-router';
import SignUpPage from '@/pages/sign-up.tsx';
import SignUpDonePage from '@/pages/sign-up-done.tsx';

export type SignUpPageSearchQuery = {
  nickName?: string;
};

export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): SignUpPageSearchQuery => {
    return {
      nickName: search?.nickName ?? '',
    } as SignUpPageSearchQuery;
  },
});

function RouteComponent() {
  const { nickName } = Route.useSearch();

  if (nickName) {
    return <SignUpDonePage nickName={nickName} />;
  }
  return <SignUpPage />;
}
