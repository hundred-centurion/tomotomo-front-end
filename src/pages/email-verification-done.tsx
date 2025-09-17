import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import AuthLayout from '@/components/layouts/auth-layout.tsx';
import { Heading, Text } from '@/components/typography.tsx';
import { useAuthStore } from '@/store/auth-store.ts';
import { Navigate, useNavigate } from '@tanstack/react-router';
import { Button } from '@/shadcn/button.tsx';
import { useVerifyEmail } from '@/hooks/auth/use-verify-email.ts';
import { toast } from 'sonner';
import type { EmailVerificationPageSearchQuery } from '@/routes/email-verification.tsx';

type EmailVerificationDonePageProps = Omit<React.ComponentProps<'div'>, 'children'> &
  Pick<EmailVerificationPageSearchQuery, 'email' | 'from' | 'token'> & {};

export default function EmailVerificationDonePage({ email, from, token, ...props }: EmailVerificationDonePageProps) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmail();

  React.useEffect(() => {
    if (token) {
      verifyEmail(token, {
        onSuccess: () => {
          if (from === '/sign-up') {
            // 회원가입 플로우인 경우 회원가입 완료 페이지로 이동
            const savedNickname = localStorage.getItem('signup_nickname') || '사용자';
            localStorage.removeItem('signup_nickname'); // 사용 후 삭제
            navigate({
              to: '/sign-up',
              search: { nickName: savedNickname },
            });
          } else {
            // 비밀번호 재설정 플로우인 경우
            navigate({ to: '/reset-password' });
          }
        },
        onError: (error) => {
          toast.error(error.message || '이메일 인증에 실패했습니다.');
          navigate({ to: '/sign-in' });
        },
      });
    }
  }, [token, from, verifyEmail, navigate]);

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <PageLayout {...props}>
      <AuthLayout>
        <div className="flex w-full max-w-[350px] flex-col items-center gap-4">
          <Heading as="h2">이메일 인증 중...</Heading>

          <div className="text-center">
            <Text className="text-muted-foreground">이메일 인증을 처리하고 있습니다.</Text>
            <Text className="text-muted-foreground">잠시만 기다려주세요.</Text>
          </div>

          <Button variant="secondary" className="w-full" disabled>
            {isVerifying ? '인증 중...' : '처리 중...'}
          </Button>
        </div>
      </AuthLayout>
    </PageLayout>
  );
}
