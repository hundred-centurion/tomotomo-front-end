import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from '@/shadcn/button.tsx';
import { ChevronsRight, Plus, Settings } from 'lucide-react';
import { Separator } from '@/shadcn/separator.tsx';
import { Checkbox } from '@/shadcn/checkbox.tsx';
import { cn } from '@/lib/utils.ts';
import type { SubTask, Task } from '@/components/task-item.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/select.tsx';
import type { TaskList } from '@/components/task-left-side-menu.tsx';
import NewTaskInput from '@/components/new-task-input.tsx';
import { Text } from '@/components/typography.tsx';

const taskRightSideMenuVariants = cva('w-0 p-0 flex flex-shrink-0 flex-col border-l transition-all duration-300');

export type TaskRightSideMenuProps = Omit<React.ComponentProps<'aside'>, 'children'> &
  VariantProps<typeof taskRightSideMenuVariants> & {
    show: boolean;
    hide: (value: boolean) => void;
    tasks: Task[];
    setTasks: (task: Task[]) => void;
    selectedTask?: Task;
    setSelectedTask: (task: Task) => void;
    lists: TaskList[];
    setLists: (lists: TaskList[]) => void;
    isAddingSubTask: boolean;
    setIsAddingSubTask: (value: boolean) => void;
  };

export default function TaskRightSideMenu({
  className,
  show = true,
  hide,
  tasks,
  setTasks,
  selectedTask,
  setSelectedTask,
  lists,
  setLists,
  isAddingSubTask,
  setIsAddingSubTask,
  ...props
}: TaskRightSideMenuProps) {
  // [추가] Task의 List를 변경하는 핸들러 함수
  const handleListChange = (taskId: number, newListName: TaskList['name']) => {
    let oldListName: TaskList['name'] | undefined;

    // 1. tasks 배열을 업데이트합니다.
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        oldListName = task.list; // 변경 전 List 이름을 저장
        const newListInfo = lists.find((l) => l.name === newListName);
        return {
          ...task,
          list: newListName,
          color: newListInfo ? newListInfo.color : 'bg-gray-300', // List에 맞는 색상으로 변경
        };
      }
      return task;
    });
    setTasks(updatedTasks);

    // 2. 현재 선택된 task의 정보도 업데이트하여 사이드바에 즉시 반영합니다.
    if (selectedTask && selectedTask.id === taskId) {
      const updatedSelectedTask = updatedTasks.find((t) => t.id === taskId);
      if (updatedSelectedTask) {
        setSelectedTask(updatedSelectedTask);
      }
    }

    // 3. 왼쪽 사이드바의 List 카운트를 업데이트합니다.
    if (oldListName && oldListName !== newListName) {
      const updatedLists = lists.map((list) => {
        if (list.name === oldListName) {
          return { ...list, count: list.count - 1 };
        }
        if (list.name === newListName) {
          return { ...list, count: list.count + 1 };
        }
        return list;
      });
      setLists(updatedLists);
    }
  };

  const handleAddSubTask = (parentTaskId: number, subtaskTitle: string) => {
    const trimmedTitle = subtaskTitle.trim();

    if (!trimmedTitle) {
      setIsAddingSubTask(false);
      return;
    }

    const newSubtask: SubTask = {
      id: Date.now(),
      title: trimmedTitle,
    };

    const updatedTasks = tasks.map((task) => {
      if (task.id === parentTaskId) {
        const existingSubtasks = task.subTasks || [];
        return {
          ...task,
          subTasks: [...existingSubtasks, newSubtask],
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    // 선택된 Task 정보도 바로 업데이트
    const updatedSelectedTask = updatedTasks.find((t) => t.id === parentTaskId);
    if (updatedSelectedTask) {
      setSelectedTask(updatedSelectedTask);
    }

    setIsAddingSubTask(false);
  };

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
            <p className="mb-6 text-sm text-gray-600">{selectedTask.description}</p>

            <div className="space-y-4 text-sm">
              {/* [수정] 기존의 단순 텍스트 표시에서 Select 컴포넌트로 변경 */}
              <div className="flex items-center justify-between">
                <span className="text-gray-500">List</span>
                <Select
                  value={selectedTask.list}
                  onValueChange={(newListName: TaskList['name']) => handleListChange(selectedTask.id, newListName)}
                >
                  <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select a list" />
                  </SelectTrigger>
                  <SelectContent>
                    {lists.map((list) => (
                      <SelectItem key={list.name} value={list.name}>
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full ${list.color} mr-3`}></div>
                          <span>{list.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Due Date</span>
                <span>{selectedTask.dueDate}</span>
              </div>
              <Separator className="my-6" />
              <h3 className="mb-2 text-sm font-semibold">Subtasks</h3>
              <div className="space-y-2">
                {selectedTask.subTasks?.map((subtask) => (
                  <div key={subtask.id} className="ml-2 flex items-center">
                    <Text as="small">{subtask.title}</Text>
                  </div>
                ))}
                {/* Subtask 추가 Input (isAddingSubtask가 true일 때 렌더링) */}
                {isAddingSubTask && (
                  <NewTaskInput
                    onAddTask={(title) => handleAddSubTask(selectedTask.id, title)}
                    className="p-0"
                    addOnBlur={false}
                    subTask
                  />
                )}
              </div>

              {/* Subtask 추가 버튼 (isAddingSubtask가 false일 때 렌더링) */}
              {!isAddingSubTask && (
                <Button
                  variant="ghost"
                  onClick={() => setIsAddingSubTask(true)}
                  className="mt-2 flex items-center text-sm text-gray-500 hover:text-gray-800"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add New Subtask
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-10 text-center text-gray-500">Select a task to see details</div>
        )}
      </div>
    </aside>
  );
}
