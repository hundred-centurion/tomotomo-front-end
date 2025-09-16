import { createFileRoute } from '@tanstack/react-router';
import SignUpPage from '@/pages/sign-up.tsx';
import SignUpDonePage from '@/pages/sign-up-done.tsx';

export type SignUpPageSearchQuery = {
  nickName?: string;
  token?: string;
};

export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): SignUpPageSearchQuery => {
    return {
      nickName: search?.nickName ?? '',
      token: search?.token ?? '',
    } as SignUpPageSearchQuery;
  },
});

function RouteComponent() {
  const { nickName, token } = Route.useSearch();

  if (nickName) {
    return <SignUpDonePage nickName={nickName} token={token} />;
  }
  return <SignUpPage />;
}
