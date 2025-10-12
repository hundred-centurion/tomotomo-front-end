import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import AuthLayout from '@/components/layouts/auth-layout.tsx';
import { Heading, Text } from '@/components/typography.tsx';
import { useForm } from 'react-hook-form';
import { type SignUpStep1Fields, SignUpStep1Schema, type SignUpStep2Fields, SignUpStep2Schema } from '@/lib/schemas.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth-store.ts';
import { Link, Navigate, useNavigate } from '@tanstack/react-router';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shadcn/form.tsx';
import { Input } from '@/shadcn/input.tsx';
import { Button } from '@/shadcn/button.tsx';
import { useSignUp } from '@/hooks/auth/use-sign-up.ts';
import { toast } from 'sonner';
import { LOG_IN_PAGE } from '@/lib/pages.ts';
import Loading from '@/components/loading.tsx';

type SignUpPageProps = Omit<React.ComponentProps<'div'>, 'children'> & {};

export default function SignUpPage({ ...props }: SignUpPageProps) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const { mutate: signUp, isPending: isSignUpPending } = useSignUp();

  const [step, setStep] = React.useState(1);
  const [step1Data, setStep1Data] = React.useState<SignUpStep1Fields | null>(null);

  const step1Form = useForm<SignUpStep1Fields>({
    mode: 'onChange',
    resolver: zodResolver(SignUpStep1Schema),
    defaultValues: {
      nickName: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const step2Form = useForm<SignUpStep2Fields>({
    mode: 'onChange',
    resolver: zodResolver(SignUpStep2Schema),
    defaultValues: {
      email: '',
    },
  });

  const handleStep1Submit = (data: SignUpStep1Fields) => {
    setStep1Data(data);
    // step2로 넘어갈 때 이메일 필드 초기화
    step2Form.setValue('email', '');
    setStep(2);
  };

  const handleStep2Submit = (data: SignUpStep2Fields) => {
    if (!step1Data) return;

    signUp(
      {
        nickName: step1Data.nickName,
        name: step1Data.nickName,
        password: step1Data.password,
        email: data.email,
      },
      {
        onSuccess: () => {
          // 닉네임을 localStorage에 저장하여 이메일 인증 완료 후 사용
          localStorage.setItem('signup_nickname', step1Data.nickName);
          navigate({
            to: '/email-verification',
            search: { type: 'ready', email: data.email, from: '/sign-up' },
          });
        },
        onError: (error) => {
          // 중복 이메일 에러는 이미 useSignUp에서 토스트로 처리됨
          if (error.message !== '중복 이메일') {
            toast.error('회원가입에 실패했습니다.');
          }
        },
      },
    );
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <PageLayout {...props}>
      <AuthLayout>
        <div className="flex w-full max-w-[280px] flex-col items-center gap-4">
          <Heading as="h2">{step === 1 ? '회원가입' : '이메일 입력'}</Heading>

          {step === 1 ? (
            <Form {...step1Form} key="step1">
              <form
                onSubmit={step1Form.handleSubmit(handleStep1Submit)}
                className="flex w-full flex-col items-center gap-4"
              >
                <FormField
                  control={step1Form.control}
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
                  control={step1Form.control}
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
                  control={step1Form.control}
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

                <Button type="submit" className="w-full">
                  다음
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...step2Form} key="step2">
              <form
                onSubmit={step2Form.handleSubmit(handleStep2Submit)}
                className="flex w-full flex-col items-center gap-4"
              >
                <FormField
                  control={step2Form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input type="email" placeholder="이메일" className="w-full border-black" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex w-full gap-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    이전
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSignUpPending}>
                    {isSignUpPending ? <Loading /> : '다음'}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          <Text as="small" className="flex gap-1 text-[#18181B]">
            이미 계정이 있으신가요?
            <Link to={LOG_IN_PAGE} className="underline">
              로그인
            </Link>
          </Text>
        </div>
      </AuthLayout>
    </PageLayout>
  );
}
