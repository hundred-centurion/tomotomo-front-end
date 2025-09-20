import * as React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  getDate,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export type CalendarProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  currentDate: Date;
  customDays?: Record<string, string>;
};

export default function Calendar({ className, currentDate, customDays = {}, ...props }: CalendarProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { locale: ko });
  const calendarEnd = endOfWeek(monthEnd, { locale: ko });

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className={cn('mx-auto w-full', className)} {...props}>
      <div className="mb-2 grid w-full grid-cols-7 text-center text-sm text-gray-500">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid w-full grid-cols-7 gap-1">
        {days.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const customDayStyle = customDays[dayKey] ? `${customDays[dayKey]} text-white` : '';

          return (
            <div
              key={day.toString()}
              className={cn(
                'flex aspect-square min-h-10 w-full items-center justify-center rounded-lg text-center transition-colors',
                // 이번 달에 속하지 않는 날짜는 연하게 처리
                !isSameMonth(day, monthStart) && 'text-gray-300',
                // 오늘 날짜는 테두리로 강조
                isToday(day) && 'border border-slate-400',
                // customDays prop으로 받은 스타일 적용
                customDayStyle,
              )}
            >
              {getDate(day)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
