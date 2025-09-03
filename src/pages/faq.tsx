import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';

type FAQPageProps = React.ComponentProps<'div'> & {};

export default function FAQPage({ children, ...props }: FAQPageProps) {
  return <PageLayout {...props}>{children}</PageLayout>;
}
