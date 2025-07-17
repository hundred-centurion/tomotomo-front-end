import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { FAQ_PAGE, type HeaderPage, INDEX_PAGE, TIMER_PAGE, TODO_PAGE } from '@/lib/pages.ts';
import { H2 } from '@/components/typography.tsx';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu.tsx';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button.tsx';
import { CircleUserRound } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const HEADER_PAGES_MAP: Record<HeaderPage, string> = {
  [INDEX_PAGE]: '홈',
  [TIMER_PAGE]: '타이머',
  [TODO_PAGE]: '할 일 목록',
  [FAQ_PAGE]: '자주 묻는 질문',
};

const headerVariants = cva(`w-full h-[var(--header-height)] px-4 flex items-center border-b lg:px-6`);

interface HeaderProps extends Omit<React.ComponentProps<'header'>, 'children'>, VariantProps<typeof headerVariants> {}

const Header: React.FC<HeaderProps> = ({ className, ...props }) => {
  const { href: currentPage } = useLocation();
  const navigate = useNavigate();

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
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                navigate({
                  to: '/auth/sign-in',
                })
              }
            >
              로그인
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigate({
                  to: '/auth/sign-up',
                })
              }
            >
              회원가입
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
