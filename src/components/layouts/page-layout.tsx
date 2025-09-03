import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import Header from '@/components/layouts/header.tsx';

const pageLayoutVariants = cva('');

type PageLayoutProps = React.ComponentProps<'div'> &
  VariantProps<typeof pageLayoutVariants> & {
    withHeader?: boolean;
    withFooter?: boolean;
  };

export default function PageLayout({
  children,
  className,
  withHeader = true,
  withFooter = false,
  ...props
}: PageLayoutProps) {
  return (
    <div className={cn(pageLayoutVariants(), className)} {...props}>
      {withHeader && <Header />}
      {children}
      {withFooter && <footer>asd</footer>}
    </div>
  );
}
