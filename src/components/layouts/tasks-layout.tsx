import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';

const tasksLayoutVariants = cva('');

type TasksLayoutProps = React.ComponentProps<'div'> & VariantProps<typeof tasksLayoutVariants> & {};

export default function TasksLayout({ children, className, ...props }: TasksLayoutProps) {
  return (
    <div className={cn(tasksLayoutVariants(), className)} {...props}>
      {children}
    </div>
  );
}
