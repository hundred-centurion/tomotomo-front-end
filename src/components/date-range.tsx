import * as React from 'react';
import { cn } from '@/lib/utils.ts';
import DatePicker from '@/components/date-picker.tsx';
import { useEffect } from 'react';
import type { Optional } from '@/types/common.ts';
import { CalendarIcon } from 'lucide-react';

export type DateRangeChange = {
  start: Optional<Date>;
  end: Optional<Date>;
};

export interface DateRangeProps extends Omit<React.ComponentProps<'div'>, 'children' | 'onChange'> {
  onChange?: (dates: DateRangeChange) => void;
}

const DateRange: React.FC<DateRangeProps> = ({ className, onChange, ...props }) => {
  const [start, setStart] = React.useState<Optional<Date>>(new Date());
  const [end, setEnd] = React.useState<Optional<Date>>(new Date());

  useEffect(() => {
    if (!onChange) {
      return;
    }

    onChange({
      start,
      end,
    });
  }, [start, end, onChange]);

  return (
    <div
      className={cn(
        'flex w-[300px] items-center justify-between gap-1 rounded-sm border border-[#D9D9D9] px-4',
        className,
      )}
      {...props}
    >
      <CalendarIcon width={22} height={22} />
      <DatePicker buttonStyle="w-auto border-none" onChange={setStart} today asChild />
      <span>-</span>
      <DatePicker buttonStyle="w-auto border-none" onChange={setEnd} today asChild />
    </div>
  );
};

export default DateRange;
