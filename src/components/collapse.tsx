import * as React from 'react';
import { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { Text } from '@/components/typography.tsx';
import { ChevronDown } from 'lucide-react';

const DefaultIcon = () => {
  return (
    <div className="flex h-4 w-4 items-center justify-center rounded-[50%] bg-[#EF4343] text-xs text-white">?</div>
  );
};

const collapseVariants = cva('flex flex-col');

export type CollapseProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof collapseVariants> & {
    icon?: React.ReactNode;
    title: string;
    content: string;
  };

export default function Collapse({ className, icon, title, content, ...props }: CollapseProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className={cn(collapseVariants(), className)} {...props}>
      <div className="flex cursor-pointer items-center" onClick={() => setOpen(!open)}>
        {icon ? <div className="flex items-center justify-center">{icon}</div> : <DefaultIcon />}

        <div className="ml-2 flex w-full items-center justify-between">
          <Text className="font-semibold">{title}</Text>
          <ChevronDown className={cn('transition', open ? 'rotate-180' : 'rotate-0')} />
        </div>
      </div>

      <div
        className={cn(
          'bg-secondary mt-5 grid w-full rounded-sm transition-all duration-300 ease-in-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="w-full p-4">
            <pre>{content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
