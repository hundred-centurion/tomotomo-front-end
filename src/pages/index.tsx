import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import IndexLayout from '@/components/layouts/index-layout.tsx';
import TitledCardContainer from '@/components/titled-card-container.tsx';
import { Text } from '@/components/typography.tsx';
import { RadioGroup, RadioGroupItem } from '@/shadcn/radio-group.tsx';
import { Label } from '@/shadcn/label.tsx';
import { CircleQuestionMark, Plus } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import DatePicker from '@/components/date-picker.tsx';
import { useState } from 'react';
import Calendar from '@/components/calendar.tsx';
import ReportButton from '@/components/report-button.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/tooltip.tsx';
import Chart from '@/components/chart.tsx';

type IndexPageProps = Omit<React.ComponentProps<'div'>, 'children'> & {};

export default function IndexPage({ ...props }: IndexPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <PageLayout {...props}>
      <IndexLayout className="flex flex-col gap-6">
        <TitledCardContainer
          title="Home"
          cardContainerClassName="grid grid-cols-3 gap-4"
          cards={[
            {
              title: '총 집중 시간',
              content: (
                <div className="flex w-full justify-end">
                  <Text>60시간 50분</Text>
                </div>
              ),
              tooltipMessage: '토모토모와 함께한 첫 순간부터 지금까지 {nickname}님이 집중한 시간이에요.',
            },
            {
              title: '오늘의 집중 시간',
              content: (
                <div className="flex w-full justify-end">
                  <Text>5시간 25분</Text>
                </div>
              ),
              tooltipMessage: '{nickname}님이 {N월 N일}에집중한 시간이에요.',
            },
            {
              title: '할 일 목록',
              content: (
                <div>
                  <RadioGroup>
                    <div className="flex w-full items-center gap-4">
                      <RadioGroupItem value="1" id="1" />
                      <Label htmlFor="1">미디어 제작 로고 제작</Label>
                    </div>
                    <div className="flex w-full items-center gap-4">
                      <RadioGroupItem value="2" id="2" />
                      <Label htmlFor="2">컴퓨터 시스템 6장 복습</Label>
                    </div>
                  </RadioGroup>
                </div>
              ),
              actions: [
                <Link to="/tasks" className="cursor-pointer">
                  <Plus className="h-4 w-4" />
                </Link>,
              ],
              tooltipMessage: '{nickname}님이 설정하신 할 일 목록이에요. 토모토모와 함께 해보아요!',
            },
          ]}
        />

        <TitledCardContainer
          title={<DatePicker value={selectedDate} onChange={setSelectedDate} />}
          actions={[
            <ReportButton
              prefix={
                <img src="/images/button/report-button-prefix.png" alt="Report Button Prefix" className="h-8 w-8" />
              }
            >
              공부 리포트 받아보기
            </ReportButton>,
          ]}
          cardContainerClassName="grid grid-cols-2 gap-4"
          cardClassName="gap-4"
          cards={[
            {
              content: <Calendar currentDate={selectedDate} />,
            },
            {
              title: '',
              actions: [
                <Tooltip>
                  <TooltipTrigger>
                    <CircleQuestionMark className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>주간 집중 그래프</TooltipContent>
                </Tooltip>,
              ],
              content: (
                <Chart
                  data={[
                    { week: '1주차', hours: 10.5 },
                    { week: '2주차', hours: 20.2 },
                    { week: '3주차', hours: 65 },
                    { week: '4주차', hours: 40.8 },
                    { week: '5주차', hours: 50 },
                  ]}
                />
              ),
            },
          ]}
        />
      </IndexLayout>
    </PageLayout>
  );
}
