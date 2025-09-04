import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';

type FAQPageProps = Omit<React.ComponentProps<'div'>, 'children'> & {};

export default function FAQPage({ ...props }: FAQPageProps) {
  return <PageLayout {...props}>FAQ</PageLayout>;
}
