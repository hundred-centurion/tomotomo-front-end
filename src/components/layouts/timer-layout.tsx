import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';

const timerLayoutVariants = cva('w-full h-content flex justify-center items-center');

type TimerLayoutProps = React.ComponentProps<'div'> & VariantProps<typeof timerLayoutVariants> & {};

export default function TimerLayout({ children, className, ...props }: TimerLayoutProps) {
  return (
    <div className={cn(timerLayoutVariants(), className)} {...props}>
      {children}
    </div>
  );
}
