import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { ChevronsLeft, GripVertical, Plus } from 'lucide-react';
import { Button } from '@/shadcn/button.tsx';
import { Avatar, AvatarFallback } from '@/shadcn/avatar.tsx';

const taskLeftSideMenuVariants = cva('w-0 p-0 flex flex-shrink-0 flex-col border-r transition-all duration-300');

export type TaskList = {
  name: 'My List' | 'Personal' | 'Work' | 'List 1';
  count: number;
  color: string;
};

export type TaskLeftSideMenuProps = Omit<React.ComponentProps<'aside'>, 'children'> &
  VariantProps<typeof taskLeftSideMenuVariants> & {
    show: boolean;
    hide: (value: boolean) => void;
    lists: TaskList[];
  };

export default function TaskLeftSideMenu({ className, show = true, hide, lists, ...props }: TaskLeftSideMenuProps) {
  return (
    <aside className={cn(taskLeftSideMenuVariants(), className, show && 'w-64 p-4')} {...props}>
      {/* [수정] 컨텐츠가 transition 중에는 보이지 않도록 overflow-hidden 추가 */}
      <div className="overflow-hidden">
        <div className="mb-7 flex items-center justify-between">
          <div className="flex items-center">
            <GripVertical className="mr-2 h-3 w-3 text-gray-400" />
            <h2 className="text-sm font-semibold">LISTS</h2>
          </div>
          {/* [추가] 사이드바 숨기기 버튼 */}
          <Button variant="ghost" size="icon" onClick={() => hide(false)}>
            <ChevronsLeft className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-2">
          {lists.map((list) => (
            <div
              key={list.name}
              className="flex cursor-pointer items-center justify-between rounded-md px-2 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <Avatar className="mr-2 h-3 w-3">
                  <AvatarFallback className={`${list.color} text-white`}></AvatarFallback>
                </Avatar>
                <span className="text-sm">{list.name}</span>
              </div>
              <span className="text-xs text-gray-500">{list.count}</span>
            </div>
          ))}
        </div>
        <button className="mt-7 flex items-center text-sm text-gray-500 hover:text-gray-800">
          <Plus className="mr-2 h-3 w-3" /> Add New List
        </button>
      </div>
    </aside>
  );
}
