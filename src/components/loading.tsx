import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { Loader } from 'lucide-react';

const loadingVariants = cva('w-full flex justify-center items-center');

export type LoadingProps = Omit<React.ComponentProps<'div'>, 'children'> & VariantProps<typeof loadingVariants> & {};

export default function Loading({ className, ...props }: LoadingProps) {
  return (
    <div className={cn(loadingVariants(), className)} {...props}>
      <Loader className="animate-spin" />
    </div>
  );
}
