import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';

const baseLayoutVariants = cva('w-full h-full');

interface BaseLayoutProps extends React.ComponentProps<'div'>, VariantProps<typeof baseLayoutVariants> {}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn(baseLayoutVariants(), className)} {...props}>
      {children}
    </div>
  );
};

export default BaseLayout;
