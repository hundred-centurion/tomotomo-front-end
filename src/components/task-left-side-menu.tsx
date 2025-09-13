import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { ChevronsLeft, GripVertical, Plus } from 'lucide-react';
import { Button } from '@/shadcn/button.tsx';
import { Avatar, AvatarFallback } from '@/shadcn/avatar.tsx';
import NewListInput from '@/components/new-list-input.tsx';

const taskLeftSideMenuVariants = cva('w-0 p-0 flex flex-shrink-0 flex-col border-r transition-all duration-300');

export type TaskList = {
  name: string;
  count: number;
  color: string;
};

export type TaskLeftSideMenuProps = Omit<React.ComponentProps<'aside'>, 'children'> &
  VariantProps<typeof taskLeftSideMenuVariants> & {
    show: boolean;
    hide: (value: boolean) => void;
    lists: TaskList[];
    setLists: (value: TaskList[]) => void;
    isAddingList: boolean;
    setIsAddingList: (value: boolean) => void;
  };

export default function TaskLeftSideMenu({
  className,
  show = true,
  hide,
  lists,
  setLists,
  isAddingList,
  setIsAddingList,
  ...props
}: TaskLeftSideMenuProps) {
  const handleAddList = (listName: string, color: string) => {
    const trimmedName = listName.trim();
    // 이름이 비어있으면 (blur 이벤트 등) 단순히 입력창만 닫습니다.
    if (!trimmedName) {
      setIsAddingList(false);
      return;
    }
    // 이미 같은 이름의 리스트가 있는지 확인합니다.
    if (lists.some((list) => list.name.toLowerCase() === trimmedName.toLowerCase())) {
      alert('A list with this name already exists.'); // 간단한 알림 처리
      return;
    }

    const newList: TaskList = {
      name: trimmedName as TaskList['name'], // 실제 앱에서는 타입 검증이 더 필요합니다.
      count: 0,
      color: color,
    };

    setLists([...lists, newList]);
    setIsAddingList(false);
  };

  return (
    <aside className={cn(taskLeftSideMenuVariants(), className, show && 'w-64 p-4')} {...props}>
      <div className="overflow-hidden">
        <div className="mb-7 flex items-center justify-between">
          <div className="flex items-center">
            <GripVertical className="mr-2 h-3 w-3 text-gray-400" />
            <h2 className="text-sm font-semibold">LISTS</h2>
          </div>

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
                <Avatar className="mr-3 h-3 w-3">
                  <AvatarFallback className={`${list.color} text-white`}></AvatarFallback>
                </Avatar>
                <span className="text-sm">{list.name}</span>
              </div>
              <span className="text-xs text-gray-500">{list.count}</span>
            </div>
          ))}
        </div>

        {isAddingList ? (
          <NewListInput onAddList={handleAddList} />
        ) : (
          <Button
            variant="ghost"
            onClick={() => setIsAddingList(true)}
            className="mt-4 flex items-center text-sm text-gray-500 hover:text-gray-800"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New List
          </Button>
        )}
      </div>
    </aside>
  );
}
