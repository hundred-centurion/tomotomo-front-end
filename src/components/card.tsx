import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';

const cardVariants = cva('');

const childrenVariants = cva('');

export interface CardProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof cardVariants>,
    VariantProps<typeof childrenVariants> {}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn(cardVariants(), className)} {...props}>
      <div className={cn(childrenVariants())}>{children}</div>
    </div>
  );
};

export default Card;
