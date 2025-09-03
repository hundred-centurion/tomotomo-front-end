import * as React from 'react';
import { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shadcn/button.tsx';
import { cn } from '@/lib/utils';

const rangeVariants = cva('flex w-full items-center justify-between');

type RangeProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof rangeVariants> & {
    label: string;
    unit: string;
    values: number[];
    initialValue?: number;
    onValueChange?: (value: number) => void;
  };

export default function Range({
  className,
  label,
  unit = '',
  values,
  initialValue = 0,
  onValueChange,
  ...props
}: RangeProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialValue === undefined) {
      return 0;
    }

    const index = values.indexOf(initialValue);
    return index > -1 ? index : 0;
  });
  const currentValue = values[currentIndex];

  const handleDecrement = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = Math.max(0, prevIndex - 1);

      if (onValueChange) {
        onValueChange(values[newIndex]);
      }
      return newIndex;
    });
  };

  const handleIncrement = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = Math.min(values.length - 1, prevIndex + 1);

      if (onValueChange) {
        onValueChange(values[newIndex]);
      }
      return newIndex;
    });
  };

  return (
    <div className={cn(rangeVariants(), className)} {...props}>
      <p className="text-foreground text-sm font-medium">{label}</p>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDecrement} disabled={currentIndex <= 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="w-12 text-center text-base font-semibold">
          {currentValue}
          {unit}
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleIncrement}
          disabled={currentIndex >= values.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
