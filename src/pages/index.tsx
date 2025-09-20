import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import IndexLayout from '@/components/layouts/index-layout.tsx';
import { Heading, Text } from '@/components/typography.tsx';
import { Button } from '@/shadcn/button.tsx';

type IndexPageProps = Omit<React.ComponentProps<'div'>, 'children'> & {};

const LAUNCH_DATE = new Date('2025-10-13T00:00:00');

const formatTimeRemaining = (timeRemaining: number) => {
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
};

export default function IndexPage({ ...props }: IndexPageProps) {
  const [timeRemaining, setTimeRemaining] = React.useState<number>(0);

  React.useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const launchTime = LAUNCH_DATE.getTime();
      const remaining = launchTime - now;
      return Math.max(0, remaining); // 음수가 되지 않도록 처리
    };

    setTimeRemaining(calculateTimeRemaining());

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PageLayout withHeader={false} {...props}>
      <IndexLayout>
        <header className="h-index-header-height flex items-center">
          <Heading as="h2" className="inline-block">
            Tomotomo
          </Heading>
        </header>

        <div className="h-index-content-height flex w-full flex-col items-center justify-center gap-14">
          <div className="flex flex-col items-center justify-center gap-5">
            <Text className="text-4xl">
              <span className="font-bold">Tomotomo</span> 서비스 런칭까지
            </Text>
            <Heading className="text-7xl tabular-nums">{formatTimeRemaining(timeRemaining)}</Heading>
            <Text className="text-4xl text-[#5F5F5F]">남았습니다</Text>
          </div>

          <div className="flex w-full items-center justify-center gap-4">
            <Text className="text-xl font-thin text-[#414141]">런칭이 기대된다면?</Text>
            <a href="https://tumblbug.com/tomotomo" target="_blank">
              <Button className="bg-[#414141]">tumblbug 펀딩 보러가기</Button>
            </a>
          </div>
        </div>
      </IndexLayout>
    </PageLayout>
  );
}
