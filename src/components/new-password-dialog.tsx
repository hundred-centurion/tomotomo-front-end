import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import {
  Dialog,
  DialogClose,
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const [step, setStep] = useState<'confirm' | 'edit'>('edit');

  const checkForm = useForm<NewPasswordConfirmFields>({
    mode: 'onChange',
    resolver: zodResolver(NewPasswordConfirmSchema),
    defaultValues: {
      password: '',
    },
  });
  const {
    formState: { isDirty: checkFormDirty },
  } = checkForm;

  const form = useForm<NewPasswordFields>({
    mode: 'onChange',
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });
  const {
    formState: { isDirty: formDirty },
  } = form;

  return (
    <div className={cn(newPasswordDialogVariants(), className)} {...props}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{step === 'confirm' ? '비밀번호 확인' : '새로운 비밀번호 입력'}</DialogTitle>
            {step === 'confirm' && (
              <DialogDescription>계속하려면 현재 비밀번호를 입력하여 본인임을 인증해주세요.</DialogDescription>
            )}
          </DialogHeader>

          {step === 'confirm' ? (
            <Form {...checkForm}>
              <form className="flex flex-col gap-4" onSubmit={checkForm.handleSubmit(console.log)}>
                <FormField
                  control={checkForm.control}
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

                <div className="flex w-full items-center justify-end gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      취소
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={!checkFormDirty}>
                    다음
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...form}>
              <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(console.log)}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="새로운 비밀번호"
                          className="w-full border-black"
                          {...field}
                        />
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

                <div className="flex w-full items-center justify-end gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      취소
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={!formDirty}>
                    변경 완료
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
