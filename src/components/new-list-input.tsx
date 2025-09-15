import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Input } from '@/shadcn/input.tsx';
import { cn } from '@/lib/utils.ts';

const newListInputVariants = cva('p-2');

export type NewListInputProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof newListInputVariants> & {
    onAddList: (listName: string, color: string) => void;
  };

const COLOR_PALETTE = [
  '#9CA3AF', // gray-400
  '#EF4444', // red-500
  '#F97316', // orange-500
  '#EAB308', // yellow-500
  '#84CC16', // lime-500
  '#22C55E', // green-500
  '#14B8A6', // teal-500
  '#06B6D4', // cyan-500
  '#0EA5E9', // sky-500
  '#3B82F6', // blue-500
  '#6366F1', // indigo-500
  '#8B5CF6', // violet-500
  '#A855F7', // purple-500
  '#D946EF', // fuchsia-500
  '#EC4899', // pink-500
  '#F43F5E', // rose-500
];

// [추가] 새로운 List를 추가하는 Input 컴포넌트
export default function NewListInput({ className, onAddList, ...props }: NewListInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef?.current) {
      return;
    }

    inputRef.current.focus();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();
      onAddList(inputValue.trim(), selectedColor);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    // e.currentTarget은 onBlur 이벤트가 붙은 div 입니다.
    // e.relatedTarget은 포커스를 새로 받게 될 요소입니다.
    // 새로 포커스를 받는 요소가 현재 컴포넌트 내부에 있지 않을 때만 닫습니다.
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      onAddList('', ''); // 컴포넌트 외부를 클릭했을 때만 닫기
    }
  };

  // [수정] onMouseDown 이벤트 핸들러를 새로 만듭니다.
  const handleColorSelect = (event: React.MouseEvent<HTMLButtonElement>, color: string) => {
    // 이 부분이 핵심입니다. onBlur 이벤트를 방지합니다.
    event.preventDefault();
    setSelectedColor(color);
    inputRef.current?.focus(); // 색상 선택 후 다시 Input에 포커스를 줍니다.
  };

  return (
    <div className={cn(newListInputVariants(), className)} onBlur={handleBlur} {...props}>
      <div className="mb-2 flex items-center">
        <div className="mr-3 h-5 w-5 flex-shrink-0 rounded-full" style={{ backgroundColor: selectedColor }}></div>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter new list name..."
          className="h-8 border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div className="grid grid-cols-8 gap-2 px-1">
        {COLOR_PALETTE.map((color) => (
          <button
            key={color}
            // [수정] onClick을 onMouseDown으로 변경합니다.
            onMouseDown={(e) => handleColorSelect(e, color)}
            className={`h-4 w-4 rounded-full transition-transform duration-150 ${selectedColor === color ? 'ring-2 ring-black ring-offset-2' : 'hover:scale-110'}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
