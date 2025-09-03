import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import Timer from '@/components/timer.tsx';
import TimerLayout from '@/components/layouts/timer-layout.tsx';

type TimerPageProps = Omit<React.ComponentProps<'div'>, 'children'> & {};

export default function TimerPage({ ...props }: TimerPageProps) {
  return (
    <PageLayout {...props}>
      <TimerLayout>
        <Timer />
      </TimerLayout>
    </PageLayout>
  );
}
