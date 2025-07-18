import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { type HeaderPage, INDEX_PAGE, TIMER_PAGE, TODO_PAGE } from '@/lib/pages.ts';
import { H2, Small } from '@/components/typography.tsx';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu.tsx';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button.tsx';
import { CircleUserRound, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/auth-store.ts';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const HEADER_PAGES_MAP: Record<HeaderPage, string> = {
  [INDEX_PAGE]: '홈',
  [TIMER_PAGE]: '타이머',
  [TODO_PAGE]: '할 일 목록',
  // [FAQ_PAGE]: '자주 묻는 질문',
};

const headerVariants = cva(`w-full h-[var(--header-height)] px-4 flex items-center border-b lg:px-6`);

interface HeaderProps extends Omit<React.ComponentProps<'header'>, 'children'>, VariantProps<typeof headerVariants> {}

const Header: React.FC<HeaderProps> = ({ className, ...props }) => {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const { href: currentPage } = useLocation();
  const navigate = useNavigate();

  const authedContent = () => {
    const onLogoutClick = () => {
      logout();
      navigate({
        to: '/',
      });
    };

    return (
      <div>
        <div className="flex flex-col gap-2 px-7 py-3">
          <Small className="text-muted-foreground">테스터01</Small>
          <Small className="text-muted-foreground">test01@gmail.com</Small>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex justify-between px-7 py-3"
          onClick={() =>
            navigate({
              to: '/auth/reset-password',
              search: {
                type: 'ready',
              },
            })
          }
        >
          <Small className="text-muted-foreground">비밀번호 변경</Small>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex justify-between px-7 py-3" onClick={onLogoutClick}>
          <Small>로그아웃</Small>
          <LogOut />
        </DropdownMenuItem>
      </div>
    );
  };

  const notAuthedContent = () => {
    return (
      <div>
        <DropdownMenuItem
          className="text-muted-foreground flex justify-between px-3 py-3"
          onClick={() =>
            navigate({
              to: '/auth/sign-in',
            })
          }
        >
          <Small>로그인</Small>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-muted-foreground flex justify-between px-3 py-3"
          onClick={() =>
            navigate({
              to: '/auth/sign-up',
            })
          }
        >
          <Small>회원가입</Small>
        </DropdownMenuItem>
      </div>
    );
  };

  return (
    <header className={cn(headerVariants(), className)} {...props}>
      <div className="w-1/6">
        <Link to={INDEX_PAGE}>
          <H2>tomotomo</H2>
        </Link>
      </div>

      <div className="w-4/6">
        <NavigationMenu>
          <NavigationMenuList>
            {Object.entries(HEADER_PAGES_MAP).map(([key, value], index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink active={key === currentPage} asChild>
                  <Link
                    to={key}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      key === currentPage && 'bg-accent text-accent-foreground',
                    )}
                  >
                    {value}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex w-1/6 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost">
              <CircleUserRound />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">{isAuth ? authedContent() : notAuthedContent()}</DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
