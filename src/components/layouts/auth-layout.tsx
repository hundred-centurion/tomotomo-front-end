import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';

const authLayoutVariants = cva('w-full h-full flex justify-center items-center');

export interface AuthLayoutProps extends React.ComponentProps<'div'>, VariantProps<typeof authLayoutVariants> {}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn(authLayoutVariants(), className)} {...props}>
      {children}
    </div>
  );
};

export default AuthLayout;
