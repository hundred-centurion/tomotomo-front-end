import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { H4, Small } from '@/components/typography.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { Info } from 'lucide-react';
import { useCallback } from 'react';

const cardVariants = cva('');

const childrenVariants = cva('');

export interface CardProps
  extends Omit<React.ComponentProps<'div'>, 'title'>,
    VariantProps<typeof cardVariants>,
    VariantProps<typeof childrenVariants> {
  childrenClassName?: string;
  title?: string;
  titlePosition?: 'inner' | 'outer';
  contentInfo?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  childrenClassName,
  title,
  titlePosition = 'inner',
  contentInfo,
  ...props
}) => {
  const titleElement = useCallback(
    (position: CardProps['titlePosition']) => {
      return (
        <div className="flex items-center gap-1">
          <H4 className={cn(position === 'outer' && 'mb-2')}>{title}</H4>
          {contentInfo && (
            <Tooltip>
              <TooltipTrigger>
                <Info width={16} height={16} />
              </TooltipTrigger>
              <TooltipContent>
                <Small>{contentInfo}</Small>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      );
    },
    [title, contentInfo],
  );

  return (
    <div className={cn(cardVariants(), className)}>
      {title && titlePosition === 'outer' && titleElement('outer')}
      <div className="rounded-sm border border-[#E4E4E7] px-[14px] py-2" {...props}>
        <div className={cn(childrenVariants(), childrenClassName)}>
          {title && titlePosition === 'inner' && titleElement('inner')}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
