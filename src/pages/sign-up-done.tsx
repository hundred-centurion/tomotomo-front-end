import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import AuthLayout from '@/components/layouts/auth-layout.tsx';
import { Heading, Text } from '@/components/typography.tsx';
import { useAuthStore } from '@/store/auth-store.ts';
import { Navigate, useNavigate } from '@tanstack/react-router';
import { Button } from '@/shadcn/button.tsx';
import { useVerifyEmail } from '@/hooks/auth/use-verify-email.ts';
import { toast } from 'sonner';
import type { SignUpPageSearchQuery } from '@/routes/sign-up.tsx';

type SignUpDonePageProps = Omit<React.ComponentProps<'div'>, 'children'> & Pick<SignUpPageSearchQuery, 'nickName' | 'token'>;

export default function SignUpDonePage({ nickName, token, ...props }: SignUpDonePageProps) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const { mutate: verifyEmail, isPending } = useVerifyEmail();

  const [isEmailVerified, setIsEmailVerified] = React.useState(false);
  const [verificationError, setVerificationError] = React.useState<string | null>(null);
  const [hasAttemptedVerification, setHasAttemptedVerification] = React.useState(false);

  // token이 있으면 이메일 인증 실행 (한 번만)
  React.useEffect(() => {
    if (token && !isEmailVerified && !verificationError && !hasAttemptedVerification && !isPending) {
      setHasAttemptedVerification(true);
      verifyEmail(token, {
        onSuccess: () => {
          setIsEmailVerified(true);
          toast.success('이메일 인증이 완료되었습니다!');
        },
        onError: (error) => {
          setVerificationError(error.message || '이메일 인증에 실패했습니다.');
          toast.error(error.message || '이메일 인증에 실패했습니다.');
        },
      });
    }
  }, [token, isEmailVerified, verificationError, hasAttemptedVerification, isPending]);

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <PageLayout {...props}>
      <AuthLayout>
        <div className="flex w-full max-w-[280px] flex-col items-center gap-4">
          <Heading as="h2">Welcome!</Heading>

          <div className="text-center">
            {token ? (
              // 이메일 인증이 필요한 경우
              <>
                {isPending ? (
                  <>
                    <Text>이메일 인증을 진행하고 있어요...</Text>
                    <Text>잠시만 기다려주세요.</Text>
                  </>
                ) : verificationError ? (
                  <>
                    <Text className="text-red-600">이메일 인증에 실패했어요.</Text>
                    <Text className="text-red-600">{verificationError}</Text>
                  </>
                ) : isEmailVerified ? (
                  <>
                    <Text>{nickName}님의 회원가입이 완료되었어요!</Text>
                    <Text>이메일 인증도 완료되었습니다.</Text>
                    <Text>Tomotomo를 사용하러 가볼까요?</Text>
                  </>
                ) : (
                  <>
                    <Text>{nickName}님의 회원가입이 완료되었어요.</Text>
                    <Text>이메일 인증을 진행하고 있어요...</Text>
                  </>
                )}
              </>
            ) : (
              // token이 없는 경우 (일반적인 회원가입 완료)
              <>
                <Text>{nickName}님의 회원가입이 완료되었어요.</Text>
                <Text>Tomotomo를 사용하러 가볼까요?</Text>
              </>
            )}
          </div>

          {(!token || isEmailVerified) && (
            <Button className="w-full" onClick={() => navigate({ to: '/sign-in' })}>
              로그인 하러 가기
            </Button>
          )}

          {token && verificationError && (
            <Button
              className="w-full"
              variant="outline"
              onClick={() => navigate({ to: '/sign-in' })}
            >
              로그인 하러 가기
            </Button>
          )}
        </div>
      </AuthLayout>
    </PageLayout>
  );
}
