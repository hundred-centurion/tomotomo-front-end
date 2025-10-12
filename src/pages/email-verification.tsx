import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import { useForm } from 'react-hook-form';
import { type EmailSubmitFields, EmailSubmitSchema } from '@/lib/schemas.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthLayout from '@/components/layouts/auth-layout.tsx';
import { Heading, Text } from '@/components/typography.tsx';
import { Input } from '@/shadcn/input.tsx';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shadcn/form.tsx';
import { useAuthStore } from '@/store/auth-store.ts';
import { Link, Navigate, useNavigate } from '@tanstack/react-router';
import { Button } from '@/shadcn/button.tsx';
import type { EmailVerificationPageSearchQuery } from '@/routes/email-verification.tsx';
import { usePasswordResetRequest } from '@/hooks/auth';
import { toast } from 'sonner';
import { LOG_IN_PAGE } from '@/lib/pages.ts';

type EmailVerificationPageProps = Omit<React.ComponentProps<'div'>, 'children'> &
  Pick<EmailVerificationPageSearchQuery, 'from'> & {};

export default function EmailVerificationPage({ from, ...props }: EmailVerificationPageProps) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);

  const navigate = useNavigate();
  const passwordResetRequest = usePasswordResetRequest();

  const form = useForm<EmailSubmitFields>({
    mode: 'onChange',
    resolver: zodResolver(EmailSubmitSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async ({ email }: EmailSubmitFields) => {
    if (!email) {
      return;
    }

    if (from) {
      // 비밀번호 재설정을 위한 이메일 전송
      try {
        await passwordResetRequest.mutateAsync({ email });
        toast.success('비밀번호 재설정 이메일이 발송되었습니다.');
        // 성공 시 이메일 인증 완료 페이지로 이동
        navigate({
          to: '/email-verification',
          search: {
            type: 'done',
            email,
          },
        });
      } catch (error) {
        toast.error('이메일 발송에 실패했습니다. 다시 시도해주세요.');
        console.error('비밀번호 재설정 요청 실패:', error);
      }
    } else {
      // 일반 이메일 인증
      navigate({
        to: '/email-verification',
        search: {
          type: 'ready',
          email,
        },
      });
    }
  };

  if (isAuth) {
    return <Navigate to="/home" />;
  }

  return (
    <PageLayout {...props}>
      <AuthLayout>
        <div className="flex w-full max-w-[350px] flex-col items-center gap-4">
          <Heading as="h2">{from ? '이메일 인증' : '이메일 입력'}</Heading>

          {from && (
            <div className="text-center">
              <Text className="text-muted-foreground">비밀번호 재설정을 위해 먼저 이메일 인증을 진행할게요.</Text>
              <Text className="text-muted-foreground">가입한 이메일 주소를 입력해주세요.</Text>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder={from ? '이메일 입력' : '이메일'} className="w-full border-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={passwordResetRequest.isPending}>
                {passwordResetRequest.isPending ? '전송 중...' : from ? '인증 메일 발송' : '다음'}
              </Button>
            </form>
          </Form>

          {!from && (
            <Text as="small" className="flex gap-1 text-[#18181B]">
              이미 계정이 있으신가요?
              <Link to={LOG_IN_PAGE} className="underline">
                로그인
              </Link>
            </Text>
          )}
        </div>
      </AuthLayout>
    </PageLayout>
  );
}
