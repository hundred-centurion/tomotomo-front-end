import { createFileRoute } from '@tanstack/react-router';

const AuthIndexPage = () => {
  return <div>Hello "/auth/"!</div>;
};

export const Route = createFileRoute('/auth/')({
  component: AuthIndexPage,
});
