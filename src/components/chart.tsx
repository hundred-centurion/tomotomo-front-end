import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shadcn/chart.tsx';
import { cn } from '@/lib/utils.ts';

const CustomBar = (props: any) => {
  const { x, y, width, height, payload, fill } = props;
  const maxValue = 60;
  const borderRadius = 0; // 상단 모서리 둥글기

  // 데이터 값이 최댓값(60)을 초과하는 경우
  if (payload.hours > maxValue) {
    const breakHeight = 4; // 끊어진 부분의 높이
    const capHeight = 10; // 상단 캡의 높이

    return (
      <g>
        <path
          d={`M${x},${y + height} L${x},${
            y + breakHeight + capHeight
          } Q${x},${y + breakHeight + capHeight - borderRadius} ${
            x + borderRadius
          },${y + breakHeight + capHeight - borderRadius} L${
            x + width - borderRadius
          },${y + breakHeight + capHeight - borderRadius} Q${x + width},${
            y + breakHeight + capHeight - borderRadius
          } ${x + width},${y + breakHeight + capHeight} L${x + width},${y + height} Z`}
          fill={fill}
        />
        <rect x={x} y={y} width={width} height={capHeight} fill={fill} rx={borderRadius} ry={borderRadius} />
      </g>
    );
  }

  return <rect {...props} rx={borderRadius} ry={borderRadius} />;
};

type WeeklyFocusData = {
  week: string;
  hours: number;
};

type ChartProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  data: WeeklyFocusData[];
};

const Y_AXIS_TICKS = [7, 10, 20, 30, 40, 50, 60];

export default function Chart({ className, data, ...props }: ChartProps) {
  const chartConfig = {
    hours: {
      label: '집중 시간',
      color: 'hsl(var(--muted-foreground))',
    },
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
        <BarChart
          accessibilityLayer
          data={data}
          margin={{
            top: 20,
            left: 0,
            right: 0,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="week"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tick={{ fill: 'var(--color-hours)', fontSize: 12 }}
          />
          <YAxis
            domain={[0, 60]}
            ticks={Y_AXIS_TICKS}
            tickFormatter={(value) => `${value}H`}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--color-hours)', fontSize: 12 }}
            width={30}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          <Bar
            dataKey="hours"
            fill="var(--color-hours)"
            radius={6}
            // Bar 컴포넌트에 shape prop으로 커스텀 컴포넌트를 전달
            shape={<CustomBar />}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
