import { createFileRoute, Outlet } from '@tanstack/react-router';
import AuthLayout from '@/components/layouts/auth-layout.tsx';

const AuthLayoutComponent = () => {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
};

export const Route = createFileRoute('/auth')({
  component: AuthLayoutComponent,
});
