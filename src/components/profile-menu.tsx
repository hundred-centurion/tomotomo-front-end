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
import { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { Text } from '@/components/typography.tsx';

const profileMenuVariants = cva('');

type ProfileMenuProps = Omit<React.ComponentProps<'div'>, 'children'> & VariantProps<typeof profileMenuVariants> & {};

export default function ProfileMenu({ className, ...props }: ProfileMenuProps) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);

  const menuContent = useMemo(() => {
    let content: React.ReactNode;

    if (isAuth) {
      content = (
        <>
          <DropdownMenuItem>닉네임 변경</DropdownMenuItem>
          <DropdownMenuItem>비밀번호 변경</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center justify-between">
            로그아웃
            <LogOut />
          </DropdownMenuItem>
        </>
      );
    } else {
      content = (
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
            <Link to="/email-verification">회원가입</Link>
          </DropdownMenuItem>
        </>
      );
    }

    return <DropdownMenuContent align="end">{content}</DropdownMenuContent>;
  }, [isAuth]);

  return (
    <div className={cn(profileMenuVariants(), className)} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <UserRound />
          </Button>
        </DropdownMenuTrigger>

        {menuContent}
      </DropdownMenu>
    </div>
  );
}
