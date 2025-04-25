import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { JSX } from 'react';
import { cn } from '@/lib/utils.ts';

const headingVariants = cva('scroll-m-20 tracking-tight', {
  variants: {
    element: {
      h1: 'text-4xl font-extrabold lg:text-5xl',
      h2: 'text-3xl font-semibold',
      h3: 'text-2xl font-semibold',
      h4: 'text-xl font-semibold',
    },
  },
});

export type HeadingVariants = VariantProps<typeof headingVariants>;

const textVariants = cva('', {
  variants: {
    element: {
      p: 'leading-7 [&:not(:first-child)]:mt-6',
      blockQuote: 'mt-6 border-l-2 pl-6 italic',
      inlineCode: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
    },
  },
});

export type TextVariants = VariantProps<typeof textVariants>;

export type HeadingProps<ElementKey extends keyof JSX.IntrinsicElements> = React.ComponentProps<ElementKey> &
  HeadingVariants;

export type TextProps<ElementKey extends keyof JSX.IntrinsicElements> = React.ComponentProps<ElementKey> & TextVariants;

export const H1: React.FC<HeadingProps<'h1'>> = ({ children, className, ...props }) => {
  return (
    <h1 className={cn(headingVariants({ element: 'h1' }), className)} {...props}>
      {children}
    </h1>
  );
};

export const H2: React.FC<HeadingProps<'h2'>> = ({ children, className, ...props }) => {
  return (
    <h2 className={cn(headingVariants({ element: 'h2' }), className)} {...props}>
      {children}
    </h2>
  );
};

export const H3: React.FC<HeadingProps<'h3'>> = ({ children, className, ...props }) => {
  return (
    <h3 className={cn(headingVariants({ element: 'h3' }), className)} {...props}>
      {children}
    </h3>
  );
};

export const H4: React.FC<HeadingProps<'h4'>> = ({ children, className, ...props }) => {
  return (
    <h4 className={cn(headingVariants({ element: 'h4' }), className)} {...props}>
      {children}
    </h4>
  );
};

export const P: React.FC<TextProps<'p'>> = ({ children, className, ...props }) => {
  return (
    <p className={cn(textVariants({ element: 'p' }), className)} {...props}>
      {children}
    </p>
  );
};

export const BlockQuote: React.FC<TextProps<'blockquote'>> = ({ children, className, ...props }) => {
  return (
    <blockquote className={cn(textVariants({ element: 'blockQuote' }), className)} {...props}>
      {children}
    </blockquote>
  );
};

export const InlineCode: React.FC<TextProps<'code'>> = ({ children, className, ...props }) => {
  return (
    <code className={cn(textVariants({ element: 'inlineCode' }), className)} {...props}>
      {children}
    </code>
  );
};

export const Lead: React.FC<TextProps<'p'>> = ({ children, className, ...props }) => {
  return (
    <p className={cn(textVariants({ element: 'lead' }), className)} {...props}>
      {children}
    </p>
  );
};

export const Large: React.FC<TextProps<'div'>> = ({ children, className, ...props }) => {
  return (
    <div className={cn(textVariants({ element: 'large' }), className)} {...props}>
      {children}
    </div>
  );
};

export const Small: React.FC<TextProps<'small'>> = ({ children, className, ...props }) => {
  return (
    <small className={cn(textVariants({ element: 'small' }), className)} {...props}>
      {children}
    </small>
  );
};

export const Muted: React.FC<TextProps<'p'>> = ({ children, className, ...props }) => {
  return (
    <p className={cn(textVariants({ element: 'muted' }), className)} {...props}>
      {children}
    </p>
  );
};
