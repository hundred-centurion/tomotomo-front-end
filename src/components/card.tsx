import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { H4, Small } from '@/components/typography.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { Info } from 'lucide-react';

const cardVariants = cva('border border-[#E4E4E7] rounded-sm px-[14px] py-2');

const childrenVariants = cva('');

export interface CardProps
  extends Omit<React.ComponentProps<'div'>, 'title'>,
    VariantProps<typeof cardVariants>,
    VariantProps<typeof childrenVariants> {
  title?: string;
  contentInfo?: string;
}

const Card: React.FC<CardProps> = ({ children, className, title, contentInfo, ...props }) => {
  return (
    <div className={cn(cardVariants(), className)} {...props}>
      <div className={cn(childrenVariants())}>
        {title && (
          <div className="flex items-center gap-1">
            <H4>{title}</H4>
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
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Card;
