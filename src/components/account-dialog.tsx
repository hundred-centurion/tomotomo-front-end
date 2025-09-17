import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shadcn/dialog.tsx';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shadcn/form.tsx';
import { useForm } from 'react-hook-form';
import { type AccountFields, AccountSchema } from '@/lib/schemas.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shadcn/input.tsx';
import { Button } from '@/shadcn/button.tsx';
import { Label } from '@/shadcn/label.tsx';
import { useChangeNickname } from '@/hooks/auth';
import { useAuthStore } from '@/store/auth-store.ts';

const accountDialogVariants = cva('');

type AccountDialogProps = React.ComponentProps<'div'> &
  VariantProps<typeof accountDialogVariants> & {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };

export default function AccountDialog({ children, className, open, onOpenChange, ...props }: AccountDialogProps) {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const changeNicknameMutation = useChangeNickname();

  const form = useForm<AccountFields>({
    mode: 'onChange',
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      email: user?.userEmail || '',
      nickName: user?.userName || '',
    },
  });

  const {
    formState: { isDirty },
  } = form;

  // 사용자 정보가 변경될 때 폼 값 업데이트
  React.useEffect(() => {
    if (user) {
      form.reset({
        email: user.userEmail || '',
        nickName: user.userName || '',
      });
    }
  }, [user, form]);

  // 폼 제출 핸들러
  const onSubmit = async (data: AccountFields) => {
    try {
      // 닉네임이 변경된 경우에만 API 호출
      if (data.nickName !== user?.userName) {
        // auth-store의 사용자 정보 업데이트
        updateUser({ userName: data.nickName });

        // 성공 시 다이얼로그 닫기
        onOpenChange(false);
      }
    } catch (error) {
      console.error('닉네임 변경 실패:', error);
    }
  };

  return (
    <div className={cn(accountDialogVariants(), className)} {...props}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>나의 계정</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label htmlFor="email">이메일</Label>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="이메일"
                          className="w-full border-black"
                          disabled={true}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nickName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label htmlFor="nickName">닉네임</Label>
                      <FormControl>
                        <Input id="nickName" placeholder="닉네임" className="w-full border-black" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex w-full items-center justify-end gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    취소
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={!isDirty || changeNicknameMutation.isPending}>
                  {changeNicknameMutation.isPending ? '변경 중...' : '변경 완료'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
