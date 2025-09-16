import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import AuthLayout from '@/components/layouts/auth-layout.tsx';
import { Heading, Text } from '@/components/typography.tsx';
import { useAuthStore } from '@/store/auth-store.ts';
import { Navigate } from '@tanstack/react-router';
import { Button } from '@/shadcn/button.tsx';
import { useResendEmail } from '@/hooks/auth/use-resend-email.ts';
import { toast } from 'sonner';
import type { EmailVerificationPageSearchQuery } from '@/routes/email-verification.tsx';

type EmailVerificationReadyPageProps = Omit<React.ComponentProps<'div'>, 'children'> &
  Pick<EmailVerificationPageSearchQuery, 'email' | 'from'> & {};

export default function EmailVerificationReadyPage({ email, from, ...props }: EmailVerificationReadyPageProps) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const { mutate: resendEmail, isPending: isResending } = useResendEmail();

  const handleResendEmail = () => {
    if (!email) return;
    resendEmail(email, {
      onSuccess: () => {
        toast.success('인증 메일 재발송이 완료되었어요. 메일함에서 인증 메일을 확인해주세요.');
      },
      onError: (error) => {
        toast.error(error.message || '이메일 재발송에 실패했습니다.');
      },
    });
  };

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
            이메일이 오지 않았나요?
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="cursor-pointer underline disabled:opacity-50"
            >
              재발송
            </button>
          </Text>
        </div>
      </AuthLayout>
    </PageLayout>
  );
}
