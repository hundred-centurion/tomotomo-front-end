import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';

const indexLayoutVariants = cva(
  'w-full max-w-[1250px] h-[calc(100vh-80px)] py-7 overflow-hidden flex flex-col mx-auto',
);

type IndexLayoutProps = React.ComponentProps<'div'> & VariantProps<typeof indexLayoutVariants> & {};

export default function IndexLayout({ children, className, ...props }: IndexLayoutProps) {
  return (
    <div className={cn(indexLayoutVariants(), className)} {...props}>
      {children}
    </div>
  );
}
