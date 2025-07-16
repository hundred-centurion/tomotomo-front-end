import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { H1, H2, H3, H4 } from '@/components/typography.tsx';
import { useMemo } from 'react';

const titledContainerVariants = cva('');

export interface TitledContainerProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof titledContainerVariants> {
  title: string;
  titleSize?: 'h1' | 'h2' | 'h3' | 'h4';
  actions?: React.ReactNode[];
}

const TitledContainer: React.FC<TitledContainerProps> = ({
  children,
  className,
  title,
  titleSize,
  actions,
  ...props
}) => {
  const titleElement = useMemo(() => {
    if (!titleSize) {
      return <H1>{title}</H1>;
    }

    switch (titleSize) {
      case 'h1':
        return <H1>{title}</H1>;
      case 'h2':
        return <H2>{title}</H2>;
      case 'h3':
        return <H3>{title}</H3>;
      case 'h4':
        return <H4>{title}</H4>;
    }
  }, [title, titleSize]);

  return (
    <div className={cn(titledContainerVariants(), className)} {...props}>
      <div className="flex w-full items-center justify-between">
        <div>{titleElement}</div>
        {actions && <div>{actions.map((node) => node)}</div>}
      </div>
      {children}
    </div>
  );
};

export default TitledContainer;
