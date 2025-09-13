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
    subTask?: boolean;
    addOnBlur?: boolean;
  };

export default function NewTaskInput({
  className,
  onAddTask,
  subTask = false,
  addOnBlur = true,
  ...props
}: NewTaskInputProps) {
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

  const handleBlur = () => {
    // addOnBlur prop이 true일 때만 blur 시 추가 로직을 실행합니다.
    if (addOnBlur && inputValue.trim()) {
      onAddTask(inputValue.trim());
    }
    // Subtask의 경우, blur 시에는 아무것도 하지 않고 그냥 입력창이 닫히게 됩니다.
  };

  return (
    <div className={cn(newTaskInputVariants(), className)} {...props}>
      {!subTask && (
        <>
          <Checkbox className="mr-3" disabled />
          <div className="mr-3 h-3 w-3 rounded-full bg-gray-400" />
        </>
      )}
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={addOnBlur ? 'Enter new task title...' : 'Enter new subtask...'}
        className="h-8 border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
