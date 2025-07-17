import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';

const indexLayoutVariants = cva('w-full h-full py-5 px-8');

export interface IndexLayoutProps extends React.ComponentProps<'div'>, VariantProps<typeof indexLayoutVariants> {}

const IndexLayout: React.FC<IndexLayoutProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn(indexLayoutVariants(), className)} {...props}>
      {children}
    </div>
  );
};

export default IndexLayout;
