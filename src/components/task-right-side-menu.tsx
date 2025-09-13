import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from '@/shadcn/button.tsx';
import { ChevronsRight, Pencil, Plus } from 'lucide-react';
import { Separator } from '@/shadcn/separator.tsx';
import { cn } from '@/lib/utils.ts';
import type { SubTask, Task } from '@/components/task-item.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/select.tsx';
import type { TaskList } from '@/components/task-left-side-menu.tsx';
import NewTaskInput from '@/components/new-task-input.tsx';
import { Text } from '@/components/typography.tsx';
import { Input } from '@/shadcn/input.tsx';
import { Textarea } from '@/shadcn/textarea.tsx';
import { useRef } from 'react';

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

    isEditingTask: boolean;
    setIsEditingTask: (value: boolean) => void;
    editingTitle: string;
    setEditingTitle: (value: string) => void;
    editingDesc: string;
    setEditingDesc: (value: string) => void;
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
  isEditingTask,
  setIsEditingTask,
  editingTitle,
  setEditingTitle,
  editingDesc,
  setEditingDesc,
  ...props
}: TaskRightSideMenuProps) {
  const editTimeoutRef = useRef<number | null>(null);

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

  const handleUpdateTask = (taskId: number, updates: { title?: string; description?: string }) => {
    // 제목이 비어있으면 업데이트하지 않음
    if (updates.title !== undefined && !updates.title.trim()) {
      alert('Title cannot be empty.');
      return;
    }

    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task));
    setTasks(updatedTasks);

    // selectedTask 상태도 업데이트하여 UI에 즉시 반영
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, ...updates });
    }
  };

  const handleSaveTaskDetails = () => {
    if (!selectedTask) {
      return;
    }

    handleUpdateTask(selectedTask.id, {
      title: editingTitle,
      description: editingDesc,
    });

    setIsEditingTask(false);
  };

  const handleEditContainerBlur = () => {
    // 100ms 뒤에 저장하도록 예약을 겁니다.
    editTimeoutRef.current = window.setTimeout(() => {
      handleSaveTaskDetails();
    }, 100);
  };

  // [추가] 컨테이너에 다시 포커스가 들어왔을 때, 예약된 저장을 취소하는 핸들러
  const handleEditContainerFocus = () => {
    if (editTimeoutRef.current) {
      clearTimeout(editTimeoutRef.current);
    }
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
            </div>

            <div className="flex flex-col gap-[100px]">
              {isEditingTask ? (
                <div className="space-y-2" onBlur={handleEditContainerBlur} onFocus={handleEditContainerFocus}>
                  {/* 제목 수정 Input */}
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTaskDetails()}
                    onBlur={handleSaveTaskDetails}
                    autoFocus
                    className="h-9 text-xl font-bold"
                  />
                  {/* 설명 수정 Textarea */}
                  <Textarea
                    value={editingDesc}
                    onChange={(e) => setEditingDesc(e.target.value)}
                    onBlur={handleSaveTaskDetails}
                    placeholder="Description"
                    className="text-sm text-gray-600"
                  />
                </div>
              ) : (
                <div>
                  <div className="group flex items-center">
                    <h2 className="text-xl font-bold">{selectedTask.title}</h2>
                    {/* 수정 아이콘 버튼 추가 */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => {
                        setEditingTitle(selectedTask.title);
                        setEditingDesc(selectedTask.description || '');
                        setIsEditingTask(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedTask?.description && (
                    <p className="mt-1 mb-6 min-h-[20px] text-sm text-gray-600">{selectedTask.description}</p>
                  )}
                </div>
              )}

              <div className="space-y-4 text-sm">
                {/* [수정] 기존의 단순 텍스트 표시에서 Select 컴포넌트로 변경 */}
                <div className="flex items-center">
                  <span className="mr-12 text-gray-500">List</span>
                  <Select
                    value={selectedTask.list}
                    onValueChange={(newListName: TaskList['name']) => handleListChange(selectedTask.id, newListName)}
                  >
                    <SelectTrigger className="!h-[30px] w-[180px] focus:ring-0 focus:ring-offset-0">
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
                <div className="flex items-center">
                  <span className="mr-6 text-gray-500">Due Date</span>
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
          </div>
        ) : (
          <div className="mt-10 text-center text-gray-500">Select a task to see details</div>
        )}
      </div>
    </aside>
  );
}
