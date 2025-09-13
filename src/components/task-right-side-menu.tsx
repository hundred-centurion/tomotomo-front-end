import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from '@/shadcn/button.tsx';
import { ChevronsRight, Plus, Settings } from 'lucide-react';
import { Separator } from '@/shadcn/separator.tsx';
import { Checkbox } from '@/shadcn/checkbox.tsx';
import { cn } from '@/lib/utils.ts';
import type { Task } from '@/components/task-item.tsx';

const taskRightSideMenuVariants = cva('w-0 p-0 flex flex-shrink-0 flex-col border-l transition-all duration-300');

export type TaskRightSideMenuProps = Omit<React.ComponentProps<'aside'>, 'children'> &
  VariantProps<typeof taskRightSideMenuVariants> & {
    show: boolean;
    hide: (value: boolean) => void;
    selectedTask?: Task;
  };

export default function TaskRightSideMenu({
  className,
  show = true,
  hide,
  selectedTask,
  ...props
}: TaskRightSideMenuProps) {
  return (
    <aside className={cn(taskRightSideMenuVariants(), className, show && 'w-80 p-4')} {...props}>
      <div className="w-full overflow-hidden">
        {' '}
        {selectedTask ? (
          <div>
            <div className="mb-4 flex items-center justify-between">
              {/* [추가] 오른쪽 사이드바 숨기기 버튼 (기존의 << 버튼을 대체) */}
              <Button variant="ghost" size="icon" onClick={() => hide(false)}>
                <ChevronsRight className="h-4 w-4" />
              </Button>
              <Settings className="h-5 w-5 cursor-pointer text-gray-500" />
            </div>
            <h2 className="mb-2 text-xl font-bold">{selectedTask.title}</h2>
            <p className="mb-6 text-sm text-gray-600">(description)</p>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">List</span>
                <span>{selectedTask.list}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Due Date</span>
                <span>{selectedTask.dueDate}</span>
              </div>
            </div>
            <Separator className="my-6" />
            <h3 className="mb-2 text-sm font-semibold">Subtasks</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox id="sub1" />
                <label htmlFor="sub1" className="ml-2 text-sm">
                  Subtask
                </label>
              </div>
              <button className="mt-2 flex items-center text-sm text-gray-500 hover:text-gray-800">
                <Plus className="mr-2 h-4 w-4" /> Add New Subtask
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-10 text-center text-gray-500">Select a task to see details</div>
        )}
      </div>
    </aside>
  );
}
