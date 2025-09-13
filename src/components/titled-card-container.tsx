import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { Card, CardHeader, CardTitle, CardContent } from '@/shadcn/card.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/tooltip.tsx';
import { CircleQuestionMark } from 'lucide-react';
import { Heading } from '@/components/typography.tsx';

const titledCardContainerVariants = cva('w-full flex flex-col gap-4');

type Card = {
  title?: string;
  content: string | React.ReactNode;
  tooltipMessage?: string;
  actions?: React.ReactNode[];
};

type TitledCardContainerProps = Omit<React.ComponentProps<'div'>, 'children' | 'title'> &
  VariantProps<typeof titledCardContainerVariants> & {
    title: string | React.ReactNode;
    cards: Card[];
    actions?: React.ReactNode[];
    cardContainerClassName?: string;
    cardClassName?: string;
  };

export default function TitledCardContainer({
  className,
  title,
  cards,
  actions,
  cardContainerClassName = '',
  cardClassName = '',
  ...props
}: TitledCardContainerProps) {
  return (
    <div className={cn(titledCardContainerVariants(), className)} {...props}>
      <div className="flex w-full items-center justify-between flex-shrink-0">
        <Heading>{title}</Heading>
        {actions && actions.map((node, index) => <React.Fragment key={index}>{node}</React.Fragment>)}
      </div>

      <div className={cn('w-full', cardContainerClassName)}>
        {cards.map(({ title, content, tooltipMessage, actions }, index) => (
          <Card key={index} className={cn('flex flex-col', cardClassName)}>
            <CardHeader className="flex w-full items-center justify-between flex-shrink-0">
              <div className={cn('flex items-center gap-2', actions ? 'w-1/2' : 'w-full')}>
                {title && <CardTitle>{title}</CardTitle>}
                {tooltipMessage && (
                  <Tooltip>
                    <TooltipTrigger>
                      <CircleQuestionMark className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>{tooltipMessage}</TooltipContent>
                  </Tooltip>
                )}
              </div>

              {actions && actions.map((node, index) => <div key={index}>{node}</div>)}
            </CardHeader>

            <CardContent className="flex-1 min-h-0 overflow-hidden">{content}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
