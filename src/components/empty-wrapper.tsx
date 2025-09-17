import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { Text, type TextElement } from '@/components/typography.tsx';

const emptyWrapperVariants = cva('w-full h-full');

type StateLike = Record<string, string | number | boolean | (string | number)[]> | boolean;

export type EmptyWrapperProps<T extends StateLike> = React.ComponentProps<'div'> &
  VariantProps<typeof emptyWrapperVariants> & {
    value: T | null;
    title?: string;
    as?: TextElement;
  };

export default function EmptyWrapper<T extends StateLike>({
  children,
  className,
  value,
  title = '값이 비어있습니다.',
  as = 'small',
  ...props
}: EmptyWrapperProps<T>) {
  return (
    <div className={cn(emptyWrapperVariants(), className)} {...props}>
      {!value ? (
        <div className="flex h-full w-full items-center justify-center">
          <Text as={as}>{title}</Text>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
