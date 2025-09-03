import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import AuthLayout from '@/components/layouts/auth-layout.tsx';
import { Heading, Text } from '@/components/typography.tsx';
import { useForm } from 'react-hook-form';
import { type SignUpFields, SignUpSchema } from '@/lib/schemas.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth-store.ts';
import { Link, Navigate, useNavigate } from '@tanstack/react-router';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/form.tsx';
import { Input } from '@/shadcn/input.tsx';
import { Button } from '@/shadcn/button.tsx';
import { Checkbox } from '@/shadcn/checkbox.tsx';
import { useSignUp } from '@/hooks/auth/use-sign-up.ts';
import { useCallback, useEffect } from 'react';
import type { SignUpPageSearchQuery } from '@/routes/sign-up.tsx';

type SignUpPageProps = Omit<React.ComponentProps<'div'>, 'children'> & Pick<SignUpPageSearchQuery, 'email'>;

export default function SignUpPage({ email, ...props }: SignUpPageProps) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);

  const navigate = useNavigate();
  const signUp = useSignUp();
  const form = useForm<SignUpFields>({
    mode: 'onChange',
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      nickName: '',
      password: '',
      passwordConfirm: '',
      terms: false,
      privacyTerms: false,
    },
  });

  const onSubmit = useCallback(
    ({ nickName, password, passwordConfirm, terms, privacyTerms }: SignUpFields) => {
      if (password !== passwordConfirm) {
        console.log('비밀번호가 다릅니다.');
        return;
      }
      if (!email) {
        console.log('이메일없음.');
        return;
      }
      if (!terms || !privacyTerms) {
        console.log('체크해줘야함.');
        return;
      }

      signUp.mutate({
        email,
        password,
        nickName,
        name: '테스트',
      });
    },
    [email, signUp],
  );

  useEffect(() => {
    if (signUp.isSuccess) {
      console.log('회원가입 성공!');
      navigate({
        to: '/sign-up',
        search: {
          type: 'done',
          email,
          nickName: form.getValues('nickName'),
        },
      });
    }
  }, [signUp.isSuccess, navigate, email, form]);

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <PageLayout {...props}>
      <AuthLayout>
        <div className="flex w-full max-w-[280px] flex-col items-center gap-4">
          <Heading as="h2">회원가입</Heading>

          <div className="text-center">
            <Text className="text-muted-foreground">이메일 인증이 완료되었어요.</Text>
            <Text className="text-muted-foreground">회원가입을 완료해 주세요.</Text>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center gap-4">
              <FormField
                control={form.control}
                name="nickName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder="닉네임" className="w-full border-black" {...field} />
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
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input type="password" placeholder="비밀번호 확인" className="w-full border-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <FormControl>
                      <Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel htmlFor="terms" className="text-muted-foreground cursor-pointer">
                      (필수) 이용약관에 동의합니다.
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="privacyTerms"
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <FormControl>
                      <Checkbox id="privacyTerms" checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel htmlFor="privacyTerms" className="text-muted-foreground cursor-pointer">
                      (필수) 개인정보 수집 및 이용에 동의합니다.
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                다음
              </Button>
            </form>
          </Form>

          <Text as="small" className="flex gap-1 text-[#18181B]">
            이미 계정이 있으신가요?
            <Link to="/sign-in" className="underline">
              로그인
            </Link>
          </Text>
        </div>
      </AuthLayout>
    </PageLayout>
  );
}
