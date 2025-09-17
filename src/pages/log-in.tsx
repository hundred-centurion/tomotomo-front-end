import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import { useAuthStore } from '@/store/auth-store.ts';
import { useForm } from 'react-hook-form';
import { type LogInFields, LogInSchema } from '@/lib/schemas.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useNavigate } from '@tanstack/react-router';
import AuthLayout from '@/components/layouts/auth-layout.tsx';
import { Heading, Text } from '@/components/typography.tsx';
import { useCallback, useEffect } from 'react';
import { useLogIn } from '@/hooks/auth/use-log-in.ts';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shadcn/form.tsx';
import { Input } from '@/shadcn/input.tsx';
import { Button } from '@/shadcn/button.tsx';

type LogInPageProps = Omit<React.ComponentProps<'div'>, 'children'> & {};

export default function LogInPage({ ...props }: LogInPageProps) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);

  const navigate = useNavigate();
  const signIn = useLogIn();
  const form = useForm<LogInFields>({
    mode: 'onChange',
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = useCallback(
    ({ email, password }: LogInFields) => {
      signIn.mutate({
        email,
        password,
      });
    },
    [signIn],
  );

  const toResetPassword = () => {
    navigate({
      to: '/email-verification',
      search: {
        from: '/log-in',
      },
    });
  };

  useEffect(() => {
    if (signIn.isSuccess) {
      navigate({
        to: '/',
      });
    }
  }, [signIn.isSuccess, navigate]);

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <PageLayout {...props}>
      <AuthLayout>
        <div className="flex w-full max-w-[280px] flex-col items-center gap-4">
          <Heading as="h2">로그인</Heading>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder="이메일" className="w-full border-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input type="password" placeholder="비밀번호" className="w-full border-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full items-center justify-end">
                <Text as="small" className="cursor-pointer underline" onClick={toResetPassword}>
                  비밀번호를 잊으셨나요?
                </Text>
              </div>
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>
          </Form>

          <Text as="small" className="flex gap-1 text-[#18181B]">
            계정이 없으신가요?
            <Link to="/sign-up" className="underline">
              회원가입
            </Link>
          </Text>
        </div>
      </AuthLayout>
    </PageLayout>
  );
}
