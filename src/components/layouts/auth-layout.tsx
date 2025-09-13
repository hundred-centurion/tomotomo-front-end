import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';

const authLayoutVariants = cva('w-full h-content flex flex-col justify-center items-center');

type AuthLayoutProps = React.ComponentProps<'div'> & VariantProps<typeof authLayoutVariants> & {};

export default function AuthLayout({ children, className, ...props }: AuthLayoutProps) {
  return (
    <div className={cn(authLayoutVariants(), className)} {...props}>
      {children}
    </div>
  );
}
