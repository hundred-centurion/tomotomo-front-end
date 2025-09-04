import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';

type ResetPasswordPageProps = React.ComponentProps<'div'> & {};

export default function ResetPasswordPage({ children, ...props }: ResetPasswordPageProps) {
  return <PageLayout {...props}>{children}</PageLayout>;
}
