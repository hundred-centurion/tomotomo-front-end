import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { type SignUpFields, SignUpSchema } from '@/lib/schema.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { H2, Small } from '@/components/typography.tsx';
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Button } from '@/components/ui/button.tsx';

const AuthSignUpPage = () => {
  const navigate = useNavigate();
  const form = useForm<SignUpFields>({
    mode: 'onChange',
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      terms: false,
      privacyTerms: false,
    },
  });

  const onSubmit = async ({ email }: SignUpFields) => {
    await navigate({
      to: '/auth/email-verification',
      search: { type: 'ready', email },
    });
  };

  return (
    <div className="flex w-full max-w-[350px] flex-col items-center px-4">
      <H2 className="mb-[32px] lg:mb-[42px]">회원가입</H2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-[14px]">
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="닉네임" className="border-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="이메일" className="border-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="비밀번호" className="border-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel htmlFor="terms" className="text-muted-foreground">
                    (필수) 이용약관에 동의합니다.
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="privacyTerms"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Checkbox id="privacyTerms" checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel htmlFor="privacyTerms" className="text-muted-foreground">
                    (필수) 개인정보 수집 및 이용에 동의합니다.
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">가입하기</Button>
          <div className="flex justify-center">
            <Small>
              이미 계정이 있으신가요?{' '}
              <Link to="/auth/sign-in" className="border-b border-b-black">
                로그인
              </Link>
            </Small>
          </div>
        </form>
      </Form>
    </div>
  );
};

export const Route = createFileRoute('/auth/sign-up')({
  component: AuthSignUpPage,
});
