import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';

type ToDoPageProps = React.ComponentProps<'div'> & {};

export default function TodoPage({ children, ...props }: ToDoPageProps) {
  return <PageLayout {...props}>{children}</PageLayout>;
}
