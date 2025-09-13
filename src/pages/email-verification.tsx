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

type EmailVerificationPageProps = Omit<React.ComponentProps<'div'>, 'children'> &
  Pick<EmailVerificationPageSearchQuery, 'from'> & {};

export default function EmailVerificationPage({ from, ...props }: EmailVerificationPageProps) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);

  const navigate = useNavigate();
  const form = useForm<EmailSubmitFields>({
    mode: 'onChange',
    resolver: zodResolver(EmailSubmitSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = ({ email }: EmailSubmitFields) => {
    if (!email) {
      return;
    }

    navigate({
      to: '/email-verification',
      search: {
        type: 'ready',
        email,
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
              <Button type="submit" className="w-full">
                {from ? '인증 메일 발송' : '다음'}
              </Button>
            </form>
          </Form>

          {!from && (
            <Text as="small" className="flex gap-1 text-[#18181B]">
              이미 계정이 있으신가요?
              <Link to="/sign-in" className="underline">
                로그인
              </Link>
            </Text>
          )}
        </div>
      </AuthLayout>
    </PageLayout>
  );
}
