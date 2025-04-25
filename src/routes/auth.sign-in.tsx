import { createFileRoute } from '@tanstack/react-router';

const AuthSignInPage = () => {
  return <div>Hello "/auth/sign-in"!</div>;
};

export const Route = createFileRoute('/auth/sign-in')({
  component: AuthSignInPage,
});
