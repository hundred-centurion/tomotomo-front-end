import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';

const homeLayoutVariants = cva('w-full max-w-[1250px] h-full py-7 overflow-hidden flex flex-col mx-auto');

type HomeLayoutProps = React.ComponentProps<'div'> & VariantProps<typeof homeLayoutVariants> & {};

export default function HomeLayout({ children, className, ...props }: HomeLayoutProps) {
  return (
    <div className={cn(homeLayoutVariants(), className)} {...props}>
      {children}
    </div>
  );
}
