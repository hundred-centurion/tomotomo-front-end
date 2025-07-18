// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import IndexLayout from '@/components/layouts/index-layout.tsx';
import TitledContainer from '@/components/titled-container.tsx';
import DateRange from '@/components/date-range.tsx';
import { type CardProps } from '@/components/card.tsx';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Calendar } from '@/components/ui/calendar.tsx';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart.tsx';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { H4, Small } from '@/components/typography.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { Info } from 'lucide-react';

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.005, // 글자 간 시간 간격
    },
  },
};

const child = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: '0%', opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const CARDS: CardProps[] = [
  {
    title: '총 집중 시간',
    contentInfo: '토모토모와 함께한 첫 순간부터 지금까지 {nickname}님이 집중한 시간이에요.',
    children: (
      <motion.div className="mt-3 flex justify-end" variants={container} initial="hidden" animate="visible">
        {'60시간 25분'.split('').map((char, index) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          <motion.span key={index} variants={child}>
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>
    ),
    className: 'w-[33.333%]',
    childrenClassName: 'h-full',
  },
  {
    title: '오늘의 집중 시간',
    contentInfo: '{nickname}님이 {N월 N일}에집중한 시간이에요.',
    children: (
      <motion.div className="mt-3 flex justify-end" variants={container} initial="hidden" animate="visible">
        {'5시간 25분'.split('').map((char, index) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          <motion.span key={index} variants={child}>
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>
    ),
    className: 'w-[33.333%]',
    childrenClassName: 'h-[90px]',
  },
  {
    title: '할 일 목록',
    children: (
      <motion.div
        className="mt-3 flex flex-col justify-end gap-2"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {[
          <div className="flex gap-2">
            <Checkbox id="1" />
            <Label htmlFor="1">미디어제작 로고 제작</Label>
          </div>,
          <div className="flex gap-2">
            <Checkbox id="2" />
            <Label htmlFor="2">컴퓨터시스템 6장 복습</Label>
          </div>,
        ].map((node, index) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          <motion.div key={index} variants={child}>
            {node}
          </motion.div>
        ))}
      </motion.div>
    ),
    className: 'w-[33.333%]',
    childrenClassName: 'h-[90px]',
  },
];

const chartData = [
  { week: '월', value: 186 },
  { week: '화', value: 305 },
  { week: '수', value: 237 },
  { week: '목', value: 73 },
  { week: '금', value: 209 },
  { week: '토', value: 214 },
  { week: '일', value: 214 },
];

const chartConfig = {
  value: {
    label: '집중도',
    color: 'var(--chart-6)',
  },
} satisfies ChartConfig;

const IndexPage = () => {
  return (
    <IndexLayout>
      <TitledContainer title="Home" titleSize="h2" actions={[<DateRange />]} className="flex flex-col gap-4">
        <div className="flex h-fit w-full gap-2">
          {CARDS.map(({ title, contentInfo, children }) => (
            <div className="w-1/3 rounded-sm border border-[#E4E4E7] px-[14px] py-2">
              <div className="flex gap-2">
                <H4>{title}</H4>
                {contentInfo && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Info width={16} height={16} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <Small>{contentInfo}</Small>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              <div>{children}</div>
            </div>
          ))}
        </div>

        <div className="flex w-full items-stretch justify-between gap-2">
          <div className="flex w-1/2 flex-col">
            <div>
              <H4>캘린더</H4>
            </div>

            <div className="mt-3 w-full flex-1 rounded-sm border border-[#E4E4E7] px-[14px] py-2">
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-expect-error */}
              <Calendar
                mode="single"
                className="w-full"
                modifiers={{
                  1: new Date(2025, 6, 1),
                  2: new Date(2025, 6, 2),
                  3: new Date(2025, 6, 3),
                  4: new Date(2025, 6, 4),
                  5: new Date(2025, 6, 5),
                  6: new Date(2025, 6, 6),
                  7: new Date(2025, 6, 7),
                  8: new Date(2025, 6, 8),
                  9: new Date(2025, 6, 9),
                  10: new Date(2025, 6, 10),
                  11: new Date(2025, 6, 11),
                  12: new Date(2025, 6, 12),
                  13: new Date(2025, 6, 13),
                  14: new Date(2025, 6, 14),
                  15: new Date(2025, 6, 15),
                  16: new Date(2025, 6, 16),
                  17: new Date(2025, 6, 17),
                  18: new Date(2025, 6, 18),
                }}
                modifiersClassNames={{
                  1: 'bg-[#71717A] color-[#000000] rounded-lg',
                  2: 'bg-[#F4F4F5] color-[#000000] rounded-lg',
                  3: 'bg-[#F4F4F5] color-[#000000] rounded-lg',
                  4: 'bg-[#F4F4F5] color-[#000000] rounded-lg',
                  5: 'bg-[#71717A] color-[#000000] rounded-lg',
                  6: 'bg-[#71717A] color-[#000000] rounded-lg',
                  7: 'bg-[#71717A] color-[#000000] rounded-lg',
                  8: 'bg-[#F4F4F5] color-[#000000] rounded-lg',
                  9: 'bg-[#F4F4F5] color-[#000000] rounded-lg',
                  10: 'bg-[#F4F4F5] color-[#000000] rounded-lg',
                  11: 'bg-[#71717A] color-[#000000] rounded-lg',
                  12: 'bg-[#71717A] color-[#000000] rounded-lg',
                  13: 'bg-[#F4F4F5] color-[#000000] rounded-lg',
                  14: 'bg-[#F4F4F5] color-[#000000] rounded-lg',
                  15: 'bg-[#E4E4E7] color-[#000000] rounded-lg',
                  16: 'bg-[#E4E4E7] color-[#000000] rounded-lg',
                  17: 'bg-[#E4E4E7] color-[#000000] rounded-lg',
                  18: 'bg-[#E4E4E7] color-[#000000] rounded-lg',
                }}
                required
              />
            </div>
          </div>

          <div className="flex w-1/2 flex-col">
            <div>
              <H4>주간 집중 그래프</H4>
            </div>

            <div className="mt-3 flex w-full flex-1 rounded-sm border border-[#E4E4E7] px-[14px] py-2">
              <ChartContainer config={chartConfig} className="w-full">
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={8} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </TitledContainer>
    </IndexLayout>
  );
};

export const Route = createFileRoute('/')({
  component: IndexPage,
});
