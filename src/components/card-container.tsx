import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import Card, { type CardProps } from '@/components/card.tsx';

const cardContainerVariants = cva('w-full flex', {
  variants: {
    align: {
      row: 'justify-between',
      column: 'flex-col',
    },
  },
  defaultVariants: {
    align: 'row',
  },
});

export interface CardContainerProps
  extends Omit<React.ComponentProps<'div'>, 'children'>,
    VariantProps<typeof cardContainerVariants> {
  values: CardProps[];
}

const CardContainer: React.FC<CardContainerProps> = ({ className, align, values, ...props }) => {
  return (
    <div className={cn(cardContainerVariants({ align }), className)} {...props}>
      {values.map((cardProps, index) => (
        <Card key={index} {...cardProps} />
      ))}
    </div>
  );
};

export default CardContainer;
