import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import AuthLayout from '@/components/layouts/auth-layout.tsx';
import { Heading, Text } from '@/components/typography.tsx';
import { useForm } from 'react-hook-form';
import { type NewPasswordFields, NewPasswordSchema } from '@/lib/schemas.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate, useNavigate } from '@tanstack/react-router';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shadcn/form.tsx';
import { Input } from '@/shadcn/input.tsx';
import { Button } from '@/shadcn/button.tsx';
import { usePasswordResetConfirm } from '@/hooks/auth/index.ts';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { LOG_IN_PAGE } from '@/lib/pages.ts';

type ResetPasswordPageProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  token?: string;
};

export default function ResetPasswordPage({ token, ...props }: ResetPasswordPageProps) {
  const navigate = useNavigate();
  const { mutate: passwordResetConfirm, isPending: isResetting } = usePasswordResetConfirm();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const form = useForm<NewPasswordFields>({
    mode: 'onChange',
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = (data: NewPasswordFields) => {
    if (!token) {
      toast.error('유효하지 않은 토큰입니다.');
      return;
    }

    passwordResetConfirm(
      {
        token,
        newPassword: data.password,
      },
      {
        onSuccess: () => {
          toast.success('비밀번호가 성공적으로 재설정되었습니다.');
          navigate({ to: LOG_IN_PAGE });
        },
        onError: (error) => {
          toast.error('비밀번호 재설정에 실패했습니다.');
        },
      },
    );
  };

  if (!token) {
    toast.error('잘못된 접근입니다.');
    return <Navigate to={LOG_IN_PAGE} />;
  }

  return (
    <PageLayout {...props}>
      <AuthLayout>
        <div className="flex w-full max-w-[280px] flex-col items-center gap-4">
          <Heading as="h2">비밀번호 재설정</Heading>

          <div className="text-center">
            {token ? (
              <>
                <Text className="text-muted-foreground">이메일 인증이 완료되었어요.</Text>
                <Text className="text-muted-foreground">비밀번호를 재설정 해주세요.</Text>
              </>
            ) : (
              <>
                <Text className="text-muted-foreground">유효하지 않은 링크입니다.</Text>
                <Text className="text-muted-foreground">비밀번호 재설정 링크를 다시 확인해 주세요.</Text>
              </>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col items-center gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="비밀번호"
                          className="w-full border-black pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
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
                      <div className="relative">
                        <Input
                          type={showPasswordConfirm ? 'text' : 'password'}
                          placeholder="비밀번호 확인"
                          className="w-full border-black pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        >
                          {showPasswordConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isResetting}>
                {isResetting ? '재설정 중...' : '재설정'}
              </Button>
            </form>
          </Form>
        </div>
      </AuthLayout>
    </PageLayout>
  );
}
