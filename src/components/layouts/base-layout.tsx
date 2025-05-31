import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import Header from '@/components/layouts/header.tsx';

const baseLayoutVariants = cva('w-full h-full');

interface BaseLayoutProps extends React.ComponentProps<'div'>, VariantProps<typeof baseLayoutVariants> {
  withHeader?: boolean;
  withFooter?: boolean;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  className,
  withHeader = true,
  withFooter = false,
  ...props
}) => {
  return (
    <div className={cn(baseLayoutVariants(), className)} {...props}>
      {withHeader && <Header />}
      <div className={`w-full ${withFooter ? 'h-[var(--content-height-with-footer)]' : 'h-[var(--content-height)]'}`}>
        {children}
      </div>
      {withFooter && <footer className={`h-[60px] w-full`}>i am footer</footer>}
    </div>
  );
};

export default BaseLayout;
