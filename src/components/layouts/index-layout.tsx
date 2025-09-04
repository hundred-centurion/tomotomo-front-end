import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';

const indexLayoutVariants = cva('w-full h-content p-7');

type IndexLayoutProps = React.ComponentProps<'div'> & VariantProps<typeof indexLayoutVariants> & {};

export default function IndexLayout({ children, className, ...props }: IndexLayoutProps) {
  return (
    <div className={cn(indexLayoutVariants(), className)} {...props}>
      {children}
    </div>
  );
}
