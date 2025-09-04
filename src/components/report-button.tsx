import * as React from 'react';
import { cn } from '@/lib/utils';

export type ReportButtonProps = Omit<React.ComponentProps<'button'>, 'prefix'> & {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

const ReportButton = React.forwardRef<HTMLButtonElement, ReportButtonProps>(
  ({ className, children, prefix, suffix, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-black',
          'px-2 py-2',
          'border-2 border-transparent',
          '[background:linear-gradient(white,white)_padding-box,linear-gradient(to_right,#EB42E7,#01E6DC,#F2EC34,#1DFF57)_border-box]',
          'transition-all duration-200 hover:shadow-md',
          'focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'cursor-pointer',
          className,
        )}
        ref={ref}
        {...props}
      >
        {prefix && <span>{prefix}</span>}
        <span>{children}</span>
        {suffix && <span>{suffix}</span>}
      </button>
    );
  },
);
ReportButton.displayName = 'ReportButton';

export default ReportButton;
