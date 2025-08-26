import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';

const todoLayoutVariants = cva('w-full h-full relative');

export interface TodoLayoutProps extends React.ComponentProps<'div'>, VariantProps<typeof todoLayoutVariants> {}

const TodoLayout: React.FC<TodoLayoutProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn(todoLayoutVariants(), className)} {...props}>
      <div className="h-full w-full">{children}</div>
    </div>
  );
};

export default TodoLayout;
