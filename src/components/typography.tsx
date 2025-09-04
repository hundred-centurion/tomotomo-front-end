import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';

const headingVariants = cva('scroll-m-20 tracking-tight', {
  variants: {
    as: {
      h1: 'text-4xl font-extrabold text-balance',
      h2: 'text-3xl font-semibold',
      h3: 'text-2xl font-semibold',
      h4: 'text-xl font-semibold',
    },
  },
});

type HeadingElements = 'h1' | 'h2' | 'h3' | 'h4';

type HeadingProps<Element extends HeadingElements> = React.ComponentProps<Element> &
  VariantProps<typeof headingVariants> & {
    as?: HeadingElements;
  };

export function Heading<Element extends HeadingElements>({
  children,
  className,
  as = 'h1',
  ...props
}: HeadingProps<Element>) {
  const Component: HeadingElements = as ?? 'h1';

  return (
    <Component className={cn(headingVariants({ as }), className)} {...props}>
      {children}
    </Component>
  );
}

const textVariants = cva('scroll-m-20 tracking-tight', {
  variants: {
    as: {
      p: 'text-[16px]',
      span: 'text-[14px]',
      small: 'text-[12px]',
    },
  },
});

type TextElement = 'p' | 'span' | 'small';

type BaseTextProps = Pick<React.ComponentProps<TextElement>, 'children' | 'className'> &
  VariantProps<typeof textVariants>;

type TextProps =
  | (BaseTextProps &
      (({ as?: 'p' } & React.ComponentPropsWithRef<'p'>) | ({ as?: 'span' } & React.ComponentPropsWithRef<'span'>)))
  | ({ as?: 'small' } & React.ComponentPropsWithRef<'small'>);

export const Text = React.forwardRef<HTMLParagraphElement | HTMLSpanElement, TextProps>(
  ({ children, className: classNames, as = 'p', ...props }, ref) => {
    const className = cn(textVariants({ as }), classNames);

    switch (as) {
      case 'p':
        return (
          <p className={className} ref={ref as React.ForwardedRef<HTMLParagraphElement>} {...props}>
            {children}
          </p>
        );
      case 'span':
        return (
          <span className={className} ref={ref as React.ForwardedRef<HTMLSpanElement>} {...props}>
            {children}
          </span>
        );
      case 'small':
        return (
          <small className={className} ref={ref as React.ForwardedRef<HTMLElement>} {...props}>
            {children}
          </small>
        );
    }
  },
);
