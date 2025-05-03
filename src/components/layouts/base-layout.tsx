import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import Header from '@/components/layouts/header.tsx';

const baseLayoutVariants = cva('w-full h-full');

interface BaseLayoutProps extends React.ComponentProps<'div'>, VariantProps<typeof baseLayoutVariants> {
  withoutHeader?: boolean;
  withoutFooter?: boolean;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  className,
  withoutHeader = false,
  withoutFooter = false,
  ...props
}) => {
  return (
    <div className={cn(baseLayoutVariants(), className)} {...props}>
      {!withoutHeader && <Header />}
      {children}
    </div>
  );
};

export default BaseLayout;
