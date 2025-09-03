import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';

type IndexPageProps = Omit<React.ComponentProps<'div'>, 'children'> & {};

export default function IndexPage({ ...props }: IndexPageProps) {
  return <PageLayout {...props}>INDEX</PageLayout>;
}
