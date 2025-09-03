import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';

type IndexPageProps = React.ComponentProps<'div'> & {};

export default function IndexPage({ children, ...props }: IndexPageProps) {
  return <PageLayout {...props}>{children}</PageLayout>;
}
