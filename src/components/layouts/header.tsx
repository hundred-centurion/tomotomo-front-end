import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import Gnb from '@/components/gnb.tsx';
import ProfileMenu from '@/components/profile-menu.tsx';
import { Heading } from '@/components/typography.tsx';
import { Link } from '@tanstack/react-router';

const headerVariants = cva('w-full h-header flex justify-center items-center px-10 border-b');

type HeaderProps = Omit<React.ComponentProps<'div'>, 'children'> & VariantProps<typeof headerVariants> & {};

export default function Header({ className, ...props }: HeaderProps) {
  return (
    <header className={cn(headerVariants(), className)} {...props}>
      <div className="flex w-full max-w-[1190px] items-center justify-between">
        <div className="w-1/5">
          <Link to="/">
            <Heading as="h2" className="inline-block">
              tomotomo
            </Heading>
          </Link>
        </div>

        <div className="flex w-4/5 items-center justify-between">
          <Gnb />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
