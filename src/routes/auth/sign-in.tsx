import { createFileRoute, Link } from '@tanstack/react-router';
import { H2, Small } from '@/components/typography.tsx';
import { useForm } from 'react-hook-form';
import { type SignInFields, SignInSchema } from '@/lib/schema.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';

const AuthSignInPage = () => {
  const form = useForm<SignInFields>({
    mode: 'onChange',
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: SignInFields) => {
    console.log(values);
  };

  return (
    <div className="flex w-full max-w-[350px] flex-col items-center px-4">
      <H2 className="mb-[32px] lg:mb-[42px]">로그인</H2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-[14px]">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="이메일" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="비밀번호" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link to="/" className="self-end border-b border-b-black">
              <Small>비밀번호를 잊으셨나요?</Small>
            </Link>
          </div>
          <Button type="submit">로그인</Button>
          <div className="flex justify-center">
            <Small>
              계정이 없으신가요?{' '}
              <Link to="/auth/sign-up" className="border-b border-b-black">
                회원가입
              </Link>
            </Small>
          </div>
        </form>
      </Form>
    </div>
  );
};

export const Route = createFileRoute('/auth/sign-in')({
  component: AuthSignInPage,
});
