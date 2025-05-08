import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { H2 } from '@/components/typography.tsx';

const headerVariants = cva(`w-full h-[var(--header-height)] px-4 flex items-center border-b lg:px-6`);

interface HeaderProps extends Omit<React.ComponentProps<'header'>, 'children'>, VariantProps<typeof headerVariants> {}

const Header: React.FC<HeaderProps> = ({ className, ...props }) => {
  return (
    <header className={cn(headerVariants(), className)} {...props}>
      <H2>tomotomo</H2>
    </header>
  );
};

export default Header;
