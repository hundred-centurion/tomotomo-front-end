import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { H2, Large, Muted, Small } from '@/components/typography.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useForm } from 'react-hook-form';
import {
  type EmailSubmitFields,
  EmailSubmitSchema,
  type ResetPasswordFields,
  ResetPasswordSchema,
} from '@/lib/schemas.ts';
import { zodResolver } from '@hookform/resolvers/zod';

type ResetPasswordPageSearchQuery = {
  type: 'ready' | 'done';
};

const ResetPasswordPage = () => {
  const { type } = Route.useSearch();
  const navigate = useNavigate();
  const emailFieldForm = useForm<EmailSubmitFields>({
    mode: 'onChange',
    resolver: zodResolver(EmailSubmitSchema),
    defaultValues: {
      email: '',
    },
  });
  const resetPasswordFieldForm = useForm<ResetPasswordFields>({
    mode: 'onChange',
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password1: '',
      password2: '',
    },
  });

  const onEmailFieldSubmit = async ({ email }: EmailSubmitFields) => {
    await navigate({
      to: '/auth/email-verification',
      search: { type: 'ready', email, nickname: '' },
    });
  };

  const onResetPasswordFieldSubmit = async ({ password1, password2 }: ResetPasswordFields) => {
    console.log('password1: ', password1);
    console.log('password2: ', password2);
  };

  return type === 'ready' ? (
    <div className="flex w-full max-w-[350px] flex-col items-center px-4">
      <H2 className="mb-[32px] lg:mb-[42px]">이메일 인증</H2>
      <div className="flex w-full flex-col gap-6">
        <Muted className="text-center">
          비밀번호 재설정을 위해 먼저 이메일 인증을 진행할게요.
          <br />
          가입한 이메일 주소를 입력해주세요.
        </Muted>

        <Form {...emailFieldForm}>
          <form onSubmit={emailFieldForm.handleSubmit(onEmailFieldSubmit)} className="flex w-full flex-col gap-[14px]">
            <FormField
              control={emailFieldForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="이메일 입력" className="border-black" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">인증 메일 발송</Button>
          </form>
        </Form>
      </div>
    </div>
  ) : (
    <div className="flex w-full max-w-[350px] flex-col items-center px-4">
      <H2 className="mb-[32px] lg:mb-[42px]">비밀번호 재설정</H2>
      <div className="flex w-full flex-col gap-6">
        <Muted className="text-center">
          이메일 인증이 완료되었어요.
          <br />
          비밀번호를 재설정해 주세요.
        </Muted>

        <Form {...resetPasswordFieldForm}>
          <form
            onSubmit={resetPasswordFieldForm.handleSubmit(onResetPasswordFieldSubmit)}
            className="flex w-full flex-col gap-[14px]"
          >
            <FormField
              control={resetPasswordFieldForm.control}
              name="password1"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="새로운 비밀번호" className="border-black" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={resetPasswordFieldForm.control}
              name="password2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="비밀번호 확인" className="border-black" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">재설정</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/auth/reset-password')({
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>): ResetPasswordPageSearchQuery => {
    return {
      type: search?.type ?? 'ready',
    } as ResetPasswordPageSearchQuery;
  },
});
