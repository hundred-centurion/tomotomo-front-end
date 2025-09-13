import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/shadcn/navigation-menu.tsx';
import { PAGE_MAP, PAGES } from '@/lib/pages.ts';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils.ts';

const gnbVariants = cva('');

type GnbProps = Omit<React.ComponentProps<'div'>, 'children'> & VariantProps<typeof gnbVariants> & {};

export default function Gnb({ className, ...props }: GnbProps) {
  return (
    <div className={cn(gnbVariants(), className)} {...props}>
      <NavigationMenu>
        <NavigationMenuList>
          {PAGES.map((page, index) => (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink asChild>
                <Link to={page}>{PAGE_MAP[page]}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
