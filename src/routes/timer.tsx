import { createFileRoute } from '@tanstack/react-router';

const TimerPage = () => {
  return <div>Hello "/timer"!</div>;
};

export const Route = createFileRoute('/timer')({
  component: TimerPage,
});
