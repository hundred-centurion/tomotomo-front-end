import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const gradientButtonVariants = cva(
  'inline-flex items-center justify-around whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground hover:bg-background/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        default: 'h-10 pl-[8px] pr-[12px] py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
  asChild?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(
          'focus:ring-ring relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg p-[2px] focus:ring-2 focus:ring-offset-2 focus:outline-none',
          className,
        )}
        ref={ref}
        {...props}
      >
        <div className="from-grad-1 via-grad-2 via-grad-3 to-grad-4 absolute inset-0 bg-gradient-to-r" />
        <div className={cn('relative h-full w-full rounded-[6px]', gradientButtonVariants({ variant, size }))}>
          {props.children}
        </div>
      </Comp>
    );
  },
);
GradientButton.displayName = 'GradientButton';

export { GradientButton, gradientButtonVariants };
