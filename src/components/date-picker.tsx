import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar.tsx';
import { useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils.ts';
import type { Optional } from '@/types/common.ts';

export interface DatePickerProps
  extends Omit<React.ComponentProps<'div'>, 'children' | 'className' | 'onChange' | 'defaultValue'> {
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  dateFormat?: string;
  today?: boolean;
  buttonStyle?: string;
  contentStyle?: string;
  asChild?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  defaultValue,
  onChange,
  placeholder = '날짜를 선택해주세요.',
  dateFormat = 'PPP',
  today = false,
  buttonStyle,
  contentStyle,
  asChild = false,
  ...props
}) => {
  const [date, setDate] = React.useState<Optional<Date>>(defaultValue);

  const onDateChange = useCallback(
    (date: Date) => {
      setDate(date);

      if (onChange) {
        onChange(date);
      }
    },
    [onChange],
  );

  useEffect(() => {
    if (today) {
      const today = new Date();
      setDate(today);
    }
  }, [today]);

  return (
    <Popover {...props}>
      <PopoverTrigger className={cn(asChild && 'px-1 py-0 shadow-none')} asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className={cn(
            'data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal',
            buttonStyle,
          )}
        >
          {date ? format(date, dateFormat) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cn('w-auto p-0', contentStyle)}>
        <Calendar mode="single" required />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
