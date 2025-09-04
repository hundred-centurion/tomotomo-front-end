import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';

type TasksPageProps = React.ComponentProps<'div'> & {};

export default function TasksPage({ children, ...props }: TasksPageProps) {
  return <PageLayout {...props}>{children}</PageLayout>;
}
