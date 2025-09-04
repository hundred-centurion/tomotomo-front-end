import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import AuthLayout from '@/components/layouts/auth-layout.tsx';
import { Heading, Text } from '@/components/typography.tsx';
import { useAuthStore } from '@/store/auth-store.ts';
import { Link, Navigate } from '@tanstack/react-router';
import { Button } from '@/shadcn/button.tsx';
import type { EmailVerificationPageSearchQuery } from '@/routes/email-verification.tsx';

type EmailVerificationReadyPageProps = Omit<React.ComponentProps<'div'>, 'children'> &
  Pick<EmailVerificationPageSearchQuery, 'email' | 'from'> & {};

export default function EmailVerificationReadyPage({ email, from, ...props }: EmailVerificationReadyPageProps) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <PageLayout {...props}>
      <AuthLayout>
        <div className="flex w-full max-w-[350px] flex-col items-center gap-4">
          <Heading as="h2">이메일 확인</Heading>

          <div className="text-center">
            <Text className="text-muted-foreground">{email}로 인증 메일을 발송해 드렸어요.</Text>
            <Text className="text-muted-foreground">인증 메일을 확인해 주세요.</Text>
          </div>

          <Button variant="secondary" className="w-full" disabled>
            인증 대기중...
          </Button>

          <Text as="small" className="flex gap-1 text-[#18181B]">
            이메일 오지 않았나요?
            <Link to="/" className="underline">
              재발송
            </Link>
          </Text>
        </div>
      </AuthLayout>
    </PageLayout>
  );
}
