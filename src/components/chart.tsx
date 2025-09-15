import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shadcn/chart.tsx';
import { type WeeklyFocusData } from '@/services/.api.ts';
import { cn } from '@/lib/utils.ts';

const CustomBar = (props: any) => {
  const { x, y, width, height, payload, fill } = props;
  const maxValue = 60;
  const borderRadius = 6; // 상단 모서리 둥글기

  // 데이터 값이 최댓값(60)을 초과하는 경우
  if (payload.focusHours > maxValue) {
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

type ChartProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  data: WeeklyFocusData[];
};

const Y_AXIS_TICKS = [7, 10, 20, 30, 40, 50, 60];

export default function Chart({ className, data, ...props }: ChartProps) {
  const chartConfig: ChartConfig = {
    focusHours: {
      label: '집중 시간',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <div className={cn('h-full w-full', className)} {...props}>
      <ChartContainer
        config={chartConfig}
        className="!aspect-none [&_.recharts-responsive-container]:!aspect-none h-full w-full [&_.recharts-responsive-container]:!h-full"
      >
        <BarChart
          data={data}
          margin={{
            top: 20,
            left: 0,
            right: 0,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="weekRange"
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
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                labelFormatter={(value) => value}
                formatter={(value) => [`${value}시간`]}
              />
            }
          />
          <Bar dataKey="focusHours" fill="var(--color-hours)" radius={6} shape={<CustomBar />} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
