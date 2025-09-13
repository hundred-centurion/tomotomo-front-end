import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { Checkbox } from '@/shadcn/checkbox.tsx';
import { Input } from '@/shadcn/input.tsx';

const newTaskInputVariants = cva('flex items-center p-2');

export type NewTaskInputProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof newTaskInputVariants> & {
    onAddTask: (title: string) => void;
  };

export default function NewTaskInput({ className, onAddTask, ...props }: NewTaskInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef?.current) {
      return;
    }

    inputRef.current.focus();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      onAddTask(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className={cn(newTaskInputVariants(), className)} {...props}>
      <Checkbox className="mr-3" disabled />
      <div className="mr-3 h-3 w-3 rounded-full bg-gray-400"></div>
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => onAddTask(inputValue.trim())}
        placeholder="Enter new task title..."
        className="h-8 border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
