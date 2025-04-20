import { createFileRoute } from '@tanstack/react-router';

const AuthSignUpPage = () => {
  return <div>Hello "/auth/sign-up"!</div>;
};

export const Route = createFileRoute('/auth/sign-up')({
  component: AuthSignUpPage,
});
