import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shadcn/chart.tsx';
import { type WeeklyFocusData } from '@/services/api.ts';
import { cn, quickSort } from '@/lib/utils.ts';
import { useMemo } from 'react';

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

export default function Chart({ className, data, ...props }: ChartProps) {
  const chartConfig: ChartConfig = {
    weekRange: {
      label: '주차',
    },
  };

  const maxFocusHour: number = useMemo(() => {
    const list: number[] = quickSort(data.map(({ focusHours }) => focusHours!));
    return list[list.length - 1];
  }, [data]);

  const yAxis = useMemo(() => {
    if (maxFocusHour <= 7) {
      return [1, 2, 3, 4, 5, 6, 7];
    } else if (maxFocusHour > 7 && maxFocusHour <= 50) {
      return [7, 14, 21, 28, 35, 42, 50];
    } else if (maxFocusHour > 50 && maxFocusHour <= 200) {
      return [50, 70, 90, 110, 130, 150, 200];
    } else {
      return [7, 10, 20, 30, 40, 50, 60];
    }
  }, [maxFocusHour]);

  const yAxisDomain = useMemo(() => {
    if (maxFocusHour <= 7) {
      return [0, 7];
    } else if (maxFocusHour > 7 && maxFocusHour <= 50) {
      return [0, 50];
    } else if (maxFocusHour > 50 && maxFocusHour <= 200) {
      return [0, 200];
    } else {
      return [0, 60];
    }
  }, [maxFocusHour]);

  return (
    <div className={cn('flex h-full w-full items-center justify-center', className)} {...props}>
      <div className="w-full">
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
              dataKey="weekNumber"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: 'var(--color-hours)', fontSize: 12 }}
              tickFormatter={(value) => `${value}주차`}
            />
            <YAxis
              domain={yAxisDomain}
              ticks={yAxis}
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
                  labelFormatter={(value) => `주차: ${value}`}
                  formatter={(value) => [`${value}시간 `, '집중 시간']}
                />
              }
            />
            <Bar dataKey="focusHours" fill="var(--color-gray-900)" radius={6} shape={<CustomBar />} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
