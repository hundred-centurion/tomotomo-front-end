import { createFileRoute } from '@tanstack/react-router';
import TimerLayout from '@/components/layouts/timer-layout.tsx';
import Timer from '@/components/timer.tsx';

const TimerLayoutComponent = () => {
  return (
    <TimerLayout>
      <div className="flex h-full w-full items-center justify-center">
        <Timer />
      </div>
    </TimerLayout>
  );
};

export const Route = createFileRoute('/timer')({
  component: TimerLayoutComponent,
});
