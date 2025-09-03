import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';

type TimerPageProps = React.ComponentProps<'div'> & {};

export default function TimerPage({ children, ...props }: TimerPageProps) {
  return <PageLayout {...props}>{children}</PageLayout>;
}
