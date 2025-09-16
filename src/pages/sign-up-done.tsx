import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import AuthLayout from '@/components/layouts/auth-layout.tsx';
import { Heading, Text } from '@/components/typography.tsx';
import { useAuthStore } from '@/store/auth-store.ts';
import { Navigate, useNavigate } from '@tanstack/react-router';
import { Button } from '@/shadcn/button.tsx';
import type { SignUpPageSearchQuery } from '@/routes/sign-up.tsx';

type SignUpDonePageProps = Omit<React.ComponentProps<'div'>, 'children'> & Pick<SignUpPageSearchQuery, 'nickName'>;

export default function SignUpDonePage({ nickName, ...props }: SignUpDonePageProps) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <PageLayout {...props}>
      <AuthLayout>
        <div className="flex w-full max-w-[280px] flex-col items-center gap-4">
          <Heading as="h2">Welcome!</Heading>

          <div className="text-center">
            <Text>{nickName}님의 회원가입이 완료되었어요.</Text>
            <Text>Tomotomo를 사용하러 가볼까요?</Text>
          </div>

          <Button className="w-full" onClick={() => navigate({ to: '/sign-in' })}>
            로그인 하러 가기
          </Button>
        </div>
      </AuthLayout>
    </PageLayout>
  );
}
