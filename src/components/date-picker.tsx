import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Check, SquareChevronDown, SquareChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/popover.tsx';
import { ScrollArea } from '@/shadcn/scroll-area.tsx';

type DatePickerProps = Omit<React.ComponentProps<'div'>, 'onChange'> & {
  value: Date;
  onChange: (date: Date) => void;
  fromYear?: number;
  toYear?: number;
};

export default function DatePicker({ value, onChange, fromYear, toYear }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const startYear = fromYear || currentYear - 10;
  const endYear = toYear || currentYear;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const [selectedYear, setSelectedYear] = useState(value.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(value.getMonth() + 1);

  const selectedYearRef = useRef<HTMLDivElement>(null);
  const selectedMonthRef = useRef<HTMLDivElement>(null);

  const handleYearChange = (year: number) => setSelectedYear(year);
  const handleMonthChange = (month: number) => setSelectedMonth(month);

  const handleApply = () => {
    const newDate = new Date(selectedYear, selectedMonth - 1);
    onChange(newDate);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedYear(value.getFullYear());
      setSelectedMonth(value.getMonth() + 1);
    }
  }, [isOpen, value]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        selectedYearRef.current?.scrollIntoView({ block: 'center' });
        selectedMonthRef.current?.scrollIntoView({ block: 'center' });
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="cursor-pointer">
        <div className="flex items-center gap-2">
          {format(value, 'yyyy.MM.')}
          {isOpen ? <SquareChevronUp className="h-5 w-5" /> : <SquareChevronDown className="h-5 w-5" />}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <div className="flex">
          <ScrollArea className="h-64 w-32 border-r">
            <div className="p-1">
              {years.map((year) => (
                <div
                  ref={selectedYear === year ? selectedYearRef : null}
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={cn(
                    'hover:bg-accent flex cursor-pointer items-center justify-end rounded-sm px-2 py-1.5 text-sm',
                    selectedYear === year && 'bg-accent justify-between font-semibold',
                  )}
                >
                  {selectedYear === year && <Check className="h-4 w-4" />}
                  {year}
                </div>
              ))}
            </div>
          </ScrollArea>

          <ScrollArea className="h-64 w-32">
            <div className="p-1">
              {months.map((month) => (
                <div
                  ref={selectedMonth === month ? selectedMonthRef : null}
                  key={month}
                  onClick={() => handleMonthChange(month)}
                  className={cn(
                    'hover:bg-accent flex cursor-pointer items-center justify-end rounded-sm px-2 py-1.5 text-sm',
                    selectedMonth === month && 'bg-accent justify-between font-semibold',
                  )}
                >
                  {selectedMonth === month && <Check className="h-4 w-4" />}
                  {String(month)}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="border-t p-2">
          <Button onClick={handleApply} className="w-full">
            적용
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
