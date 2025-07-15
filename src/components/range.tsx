import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { Button } from '@/components/ui/button.tsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Large } from '@/components/typography.tsx';
import { useCallback, useState } from 'react';

const rangeVariants = cva('w-full flex items-center');

type RangeProps = Omit<React.ComponentProps<'div'>, 'children' | 'onChange'> &
  VariantProps<typeof rangeVariants> & {
    initialValue: number;
    gap: number;
    min: number;
    max: number;
    suffix?: string;
    onChange?: ({ type, value }: { type: 'minus' | 'plus'; value: number }) => void;
  };

const Range: React.FC<RangeProps> = ({ className, initialValue, gap, min, max, suffix = '회', onChange, ...props }) => {
  const [value, setValue] = useState<number>(initialValue);

  const onLeft = useCallback(() => {
    const nextValue = value - gap;

    if (nextValue < min) {
      return;
    }

    setValue(nextValue);

    if (onChange) {
      onChange({ type: 'minus', value: nextValue });
    }
  }, [value, gap, min, onChange]);

  const onRight = useCallback(() => {
    const nextValue = value + gap;

    if (nextValue > max) {
      return;
    }

    setValue(nextValue);

    if (onChange) {
      onChange({ type: 'plus', value: nextValue });
    }
  }, [value, gap, max, onChange]);

  return (
    <div className={cn(rangeVariants(), className)} {...props}>
      <Button variant="ghost" disabled={value === min} onClick={onLeft}>
        <ChevronLeft />
      </Button>
      <Large>
        {value} {suffix}
      </Large>
      <Button variant="ghost" disabled={value === max} onClick={onRight}>
        <ChevronRight />
      </Button>
    </div>
  );
};

export default Range;
