import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';

const indexLayoutVariants = cva('w-full h-[calc(100vh-80px)] p-7 overflow-hidden flex flex-col');

type IndexLayoutProps = React.ComponentProps<'div'> & VariantProps<typeof indexLayoutVariants> & {};

export default function IndexLayout({ children, className, ...props }: IndexLayoutProps) {
  return (
    <div className={cn(indexLayoutVariants(), className)} {...props}>
      {children}
    </div>
  );
}
