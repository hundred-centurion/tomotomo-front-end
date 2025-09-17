import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import Loading from '@/components/loading.tsx';
import { cn } from '@/lib/utils.ts';

const loadingWrapperVariants = cva('w-full h-full');

export type LoadingWrapperProps = React.ComponentProps<'div'> &
  VariantProps<typeof loadingWrapperVariants> & {
    loading: boolean;
  };

export default function LoadingWrapper({ children, className, loading, ...props }: LoadingWrapperProps) {
  return (
    <div className={cn(loadingWrapperVariants(), className)} {...props}>
      {loading ? <Loading /> : children}
    </div>
  );
}
