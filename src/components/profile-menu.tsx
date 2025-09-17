import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shadcn/dropdown-menu.tsx';
import { Button } from '@/shadcn/button.tsx';
import { LogOut, UserRound } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store.ts';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Text } from '@/components/typography.tsx';
import AccountDialog from '@/components/account-dialog.tsx';
import NewPasswordDialog from '@/components/new-password-dialog.tsx';
import { useLogout } from '@/hooks/auth/use-logout.ts';

const profileMenuVariants = cva('');

type ProfileMenuProps = Omit<React.ComponentProps<'div'>, 'children'> & VariantProps<typeof profileMenuVariants> & {};

export default function ProfileMenu({ className, ...props }: ProfileMenuProps) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const [accountDialogOpen, setAccountDialogOpen] = useState<boolean>(false);
  const [newPasswordDialogOpen, setNewPasswordDialogOpen] = useState<boolean>(false);

  return (
    <div className={cn(profileMenuVariants(), className)} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <UserRound />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {isAuth ? (
            <>
              {user?.userName && user?.userEmail && (
                <div className="flex w-full flex-col gap-1 px-4 py-2">
                  <Text as="small">{user.userName}</Text>
                  <Text as="small">{user.userEmail}</Text>
                </div>
              )}
              <DropdownMenuSeparator />
              <AccountDialog open={accountDialogOpen} onOpenChange={setAccountDialogOpen}>
                <DropdownMenuItem onSelect={(event) => event.preventDefault()}>닉네임 변경</DropdownMenuItem>
              </AccountDialog>
              <NewPasswordDialog open={newPasswordDialogOpen} onOpenChange={setNewPasswordDialogOpen}>
                <DropdownMenuItem onSelect={(event) => event.preventDefault()}>비밀번호 변경</DropdownMenuItem>
              </NewPasswordDialog>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center justify-between"
                onClick={() => logout()}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                <LogOut />
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <div className="flex flex-col p-1.5">
                <Text as="span">환영합니다!</Text>
                <Text as="span">로그인을 진행해주세요.</Text>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/sign-in">로그인</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/sign-up">회원가입</Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
