import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from '@/shadcn/button.tsx';
import { ChevronsRight, Pencil, Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/shadcn/separator.tsx';
import { cn } from '@/lib/utils.ts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/select.tsx';
import NewTaskInput from '@/components/new-task-input.tsx';
import { Text } from '@/components/typography.tsx';
import { Input } from '@/shadcn/input.tsx';
import { Textarea } from '@/shadcn/textarea.tsx';
import { useRef } from 'react';
import { Label } from '@/shadcn/label.tsx';
import { Checkbox } from '@/shadcn/checkbox.tsx';
import type { TaskResponse, TaskListResponse } from '@/services/.api.ts';
import {
  useUpdateTask,
  useSubtasksByTask,
  useCreateSubtask,
  useDeleteSubtask,
  useCompleteSubtask,
  useUncompleteSubtask,
} from '@/hooks';

const taskRightSideMenuVariants = cva('w-0 p-0 flex flex-shrink-0 flex-col border-l transition-all duration-300');

export type TaskRightSideMenuProps = Omit<React.ComponentProps<'aside'>, 'children'> &
  VariantProps<typeof taskRightSideMenuVariants> & {
    show: boolean;
    hide: (value: boolean) => void;
    selectedTask?: TaskResponse | null;
    setSelectedTask: (task: TaskResponse | null) => void;
    lists: TaskListResponse[];
    isAddingSubTask: boolean;
    setIsAddingSubTask: (value: boolean) => void;

    isEditingTitle: boolean;
    setIsEditingTitle: (value: boolean) => void;
    isEditingDescription: boolean;
    setIsEditingDescription: (value: boolean) => void;
    editingTitle: string;
    setEditingTitle: (value: string) => void;
    editingDesc: string;
    setEditingDesc: (value: string) => void;
  };

export default function TaskRightSideMenu({
  className,
  show = true,
  hide,
  selectedTask,
  setSelectedTask,
  lists,
  isAddingSubTask,
  setIsAddingSubTask,
  isEditingTitle,
  setIsEditingTitle,
  isEditingDescription,
  setIsEditingDescription,
  editingTitle,
  setEditingTitle,
  editingDesc,
  setEditingDesc,
  ...props
}: TaskRightSideMenuProps) {
  const editTimeoutRef = useRef<number | null>(null);
  const updateTask = useUpdateTask();

  // Subtasks 관련 hooks
  const { data: subtasks = [] } = useSubtasksByTask(selectedTask?.id || 0);
  const createSubtask = useCreateSubtask();
  const deleteSubtask = useDeleteSubtask();
  const completeSubtask = useCompleteSubtask();
  const uncompleteSubtask = useUncompleteSubtask();

  // [추가] Task의 List를 변경하는 핸들러 함수
  const handleListChange = (taskId: number, newListName: string) => {
    if (!selectedTask || !selectedTask.dueDate) return;

    const newList = lists.find((l) => l.name === newListName);
    if (!newList) return;

    updateTask.mutate({
      taskId,
      data: {
        title: selectedTask.title || '',
        description: selectedTask.description,
        dueDate: selectedTask.dueDate,
        taskListId: newList.id,
      },
    });

    // selectedTask 상태를 실시간으로 업데이트
    setSelectedTask({
      ...selectedTask,
      taskListId: newList.id,
      taskListName: newList.name,
      taskListColor: newList.color,
    });
  };

  const handleAddSubTask = (_parentTaskId: number, subtaskTitle: string) => {
    const trimmedTitle = subtaskTitle.trim();

    if (!trimmedTitle || !selectedTask?.id) {
      setIsAddingSubTask(false);
      return;
    }

    createSubtask.mutate({
      taskId: selectedTask.id,
      title: trimmedTitle,
    });

    setIsAddingSubTask(false);
  };

  const handleToggleSubtaskCompletion = (subtaskId: number, completed: boolean) => {
    if (completed) {
      completeSubtask.mutate(subtaskId);
    } else {
      uncompleteSubtask.mutate(subtaskId);
    }
  };

  const handleDeleteSubtask = (subtaskId: number) => {
    if (confirm('정말로 이 서브태스크를 삭제하시겠습니까?')) {
      deleteSubtask.mutate(subtaskId);
    }
  };

  const handleUpdateTask = (taskId: number, updates: { title?: string; description?: string }) => {
    if (!selectedTask || !selectedTask.dueDate) return;

    // 제목이 비어있으면 업데이트하지 않음
    if (updates.title !== undefined && !updates.title.trim()) {
      alert('Title cannot be empty.');
      return;
    }

    updateTask.mutate({
      taskId,
      data: {
        title: updates.title ?? selectedTask.title ?? '',
        description: updates.description ?? selectedTask.description,
        dueDate: selectedTask.dueDate,
      },
    });
  };

  const handleSaveTitle = () => {
    if (!selectedTask || !selectedTask.id) {
      return;
    }

    handleUpdateTask(selectedTask.id, {
      title: editingTitle,
    });

    // selectedTask 상태를 실시간으로 업데이트
    setSelectedTask({
      ...selectedTask,
      title: editingTitle,
    });

    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    if (!selectedTask || !selectedTask.id) {
      return;
    }

    handleUpdateTask(selectedTask.id, {
      description: editingDesc,
    });

    // selectedTask 상태를 실시간으로 업데이트
    setSelectedTask({
      ...selectedTask,
      description: editingDesc,
    });

    setIsEditingDescription(false);
  };

  const handleTitleBlur = () => {
    // 100ms 뒤에 저장하도록 예약합니다.
    editTimeoutRef.current = window.setTimeout(() => {
      handleSaveTitle();
    }, 100);
  };

  const handleDescriptionBlur = () => {
    // 100ms 뒤에 저장하도록 예약합니다.
    editTimeoutRef.current = window.setTimeout(() => {
      handleSaveDescription();
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
              <Button variant="ghost" size="icon" className="h-[24px] w-[24px]" onClick={() => hide(false)}>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col gap-[100px]">
              <div className="flex flex-col gap-2">
                {/* Title 편집 영역 */}
                {isEditingTitle ? (
                  <div onFocus={handleEditContainerFocus}>
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                      onBlur={handleTitleBlur}
                      autoFocus
                      className="h-9 text-xl font-bold"
                    />
                  </div>
                ) : (
                  <div className="group flex items-center">
                    <h2 className="text-[22px] font-bold">{selectedTask.title}</h2>
                    {/* Title 수정 아이콘 버튼 */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => {
                        setEditingTitle(selectedTask.title || '');
                        setIsEditingTitle(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Description 편집 영역 */}
                {isEditingDescription ? (
                  <div onFocus={handleEditContainerFocus}>
                    <Textarea
                      value={editingDesc}
                      onChange={(e) => setEditingDesc(e.target.value)}
                      onBlur={handleDescriptionBlur}
                      placeholder="Description"
                      className="text-sm text-gray-600"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="group flex items-start">
                    <div className="flex-1">
                      {selectedTask?.description ? (
                        <p className="mt-1 mb-6 min-h-[20px] text-sm text-gray-600">{selectedTask.description}</p>
                      ) : (
                        <p className="mt-1 mb-6 min-h-[20px] text-sm text-gray-400 italic">No description</p>
                      )}
                    </div>
                    {/* Description 수정 아이콘 버튼 */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => {
                        setEditingDesc(selectedTask.description || '');
                        setIsEditingDescription(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4 text-sm">
                {/* [수정] 기존의 단순 텍스트 표시에서 Select 컴포넌트로 변경 */}
                <div className="flex items-center">
                  <span className="mr-12 text-[12px] text-gray-500">List</span>
                  <Select
                    value={selectedTask.taskListName || ''}
                    onValueChange={(newListName: string) =>
                      selectedTask.id && handleListChange(selectedTask.id, newListName)
                    }
                  >
                    <SelectTrigger className="!h-[30px] w-[180px] px-1 focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="Select a list" />
                    </SelectTrigger>
                    <SelectContent>
                      {lists.map((list) => (
                        <SelectItem key={list.name} value={list.name || ''} className="px-2">
                          <div className="flex items-center">
                            <div className={`mr-2 h-3 w-3 rounded-full`} style={{ backgroundColor: list.color }}></div>
                            <span className="text-xs text-gray-600">{list.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center">
                  <span className="mr-7 text-[12px] text-gray-500">Due Date</span>
                  <span className="text-gray-600">{selectedTask.dueDate || 'No due date'}</span>
                </div>
                <Separator className="my-6" />
                <h3 className="mb-2 text-[17.5px] font-semibold">Subtasks</h3>
                <div className="space-y-2">
                  {subtasks.map((subtask) => (
                    <div key={subtask.id} className="group flex items-center">
                      <Checkbox
                        id={String(subtask.id)}
                        className="mr-2"
                        checked={subtask.completed}
                        onCheckedChange={(checked) => {
                          if (subtask.id) {
                            handleToggleSubtaskCompletion(subtask.id, !!checked);
                          }
                        }}
                      />
                      <Label htmlFor={String(subtask.id)} className="flex-1">
                        <Text as="small" className={subtask.completed ? 'text-gray-500 line-through' : ''}>
                          {subtask.title}
                        </Text>
                      </Label>
                      {/* 삭제 버튼 */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => subtask.id && handleDeleteSubtask(subtask.id)}
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {/* Subtask 추가 Input (isAddingSubtask가 true일 때 렌더링) */}
                  {isAddingSubTask && selectedTask?.id && (
                    <NewTaskInput
                      onAddTask={(title) => handleAddSubTask(selectedTask.id!, title)}
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
                    className="mt-2 flex items-center text-xs text-gray-500 hover:text-gray-800"
                  >
                    <Plus className="mr-[2px] h-4 w-4" /> Add New Subtask
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
