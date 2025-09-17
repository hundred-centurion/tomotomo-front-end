import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn/dialog.tsx';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shadcn/form.tsx';
import { useForm } from 'react-hook-form';
import {
  type NewPasswordConfirmFields,
  NewPasswordConfirmSchema,
  type NewPasswordFields,
  NewPasswordSchema,
} from '@/lib/schemas.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shadcn/input.tsx';
import { Button } from '@/shadcn/button.tsx';
import { useState } from 'react';
import { useChangePassword, useVerifyPassword } from '@/hooks/auth';
import { toast } from 'sonner';

const newPasswordDialogVariants = cva('');

type NewPasswordDialogProps = React.ComponentProps<'div'> &
  VariantProps<typeof newPasswordDialogVariants> & {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };

export default function NewPasswordDialog({
  children,
  className,
  open,
  onOpenChange,
  ...props
}: NewPasswordDialogProps) {
  const [step, setStep] = useState<'confirm' | 'edit'>('confirm');

  const changePasswordMutation = useChangePassword();
  const verifyPasswordMutation = useVerifyPassword();

  const checkForm = useForm<NewPasswordConfirmFields>({
    mode: 'onChange',
    resolver: zodResolver(NewPasswordConfirmSchema),
    defaultValues: {
      password: '',
    },
  });

  const form = useForm<NewPasswordFields>({
    mode: 'onChange',
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  const handleCurrentPasswordSubmit = (data: NewPasswordConfirmFields) => {
    verifyPasswordMutation.mutate(
      { currentPassword: data.password },
      {
        onSuccess: () => {
          setStep('edit');
        },
        onError: (error) => {
          toast.error(error.message || '비밀번호가 일치하지 않습니다.');
        },
      },
    );
  };

  const handleNewPasswordSubmit = (data: NewPasswordFields) => {
    changePasswordMutation.mutate(
      {
        newPassword: data.password,
      },
      {
        onSuccess: () => {
          toast.success('비밀번호가 성공적으로 변경되었습니다.');
          onOpenChange(false);
          // 폼 리셋
          checkForm.reset();
          form.reset();
          setStep('confirm');
        },
        onError: (error) => {
          toast.error(error.message || '비밀번호 변경에 실패했습니다.');
        },
      },
    );
  };

  const handleCancel = () => {
    onOpenChange(false);
    checkForm.reset();
    form.reset();
    setStep('confirm');
  };

  return (
    <div className={cn(newPasswordDialogVariants(), className)} {...props}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {step === 'confirm' ? '비밀번호 확인' : '새로운 비밀번호 입력'}
            </DialogTitle>
            {step === 'confirm' && (
              <DialogDescription className="text-sm text-gray-600">
                계속하려면 현재 비밀번호를 입력하여 본인임을 인증해주세요.
              </DialogDescription>
            )}
            {step === 'edit' && (
              <DialogDescription className="text-sm text-gray-600">
                계속하려면 현재 비밀번호를 입력하여 본인임을 인증해주세요.
              </DialogDescription>
            )}
          </DialogHeader>

          {step === 'confirm' ? (
            <Form {...checkForm} key="confirm">
              <form className="flex flex-col gap-4" onSubmit={checkForm.handleSubmit(handleCurrentPasswordSubmit)}>
                <FormField
                  control={checkForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="비밀번호"
                          className="w-full border-gray-300 focus:border-black focus:ring-black"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="flex w-full items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    disabled={!checkForm.formState.isValid || checkForm.formState.isSubmitting || verifyPasswordMutation.isPending}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    {verifyPasswordMutation.isPending ? '확인 중...' : '다음'}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...form} key="edit">
              <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(handleNewPasswordSubmit)}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="새로운 비밀번호"
                          className="w-full border-gray-300 focus:border-black focus:ring-black"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="비밀번호 확인"
                          className="w-full border-gray-300 focus:border-black focus:ring-black"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="flex w-full items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !form.formState.isValid || form.formState.isSubmitting || changePasswordMutation.isPending
                    }
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    {changePasswordMutation.isPending ? '변경 중...' : '변경 완료'}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
