import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';

const timerLayoutVariants = cva('w-full h-full flex justify-center items-center');

export interface TimerLayoutProps extends React.ComponentProps<'div'>, VariantProps<typeof timerLayoutVariants> {}

const TimerLayout: React.FC<TimerLayoutProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn(timerLayoutVariants(), className)} {...props}>
      <div className="h-full w-full max-w-[600px]">{children}</div>
    </div>
  );
};

export default TimerLayout;
