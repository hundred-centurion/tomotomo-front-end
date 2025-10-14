import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useEffect, useState } from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import TasksLayout from '@/components/layouts/tasks-layout.tsx';
import { Button } from '@/shadcn/button.tsx';
import TaskItem from '@/components/task-item.tsx';
import TaskPagination from '@/components/task-pagination.tsx';
import { cn } from '@/lib/utils.ts';
import { ChevronsLeft, ChevronsRight, Plus, ArrowLeft } from 'lucide-react';
import NewTaskInput from '@/components/new-task-input.tsx';
import { Separator } from '@/shadcn/separator.tsx';
import TaskLeftSideMenu from '@/components/task-left-side-menu.tsx';
import TaskRightSideMenu from '@/components/task-right-side-menu.tsx';
import { Heading, Text } from '@/components/typography.tsx';
import { useCompleteTask, useUncompleteTask, useCreateTask, useTaskLists, useTasks } from '@/hooks';
import type { TaskResponse } from '@/services/api.ts';
import { Navigate } from '@tanstack/react-router';
import { useAuthStore } from '@/store';
import { LOG_IN_PAGE } from '@/lib/pages.ts';

const taskPageVariants = cva('flex h-screen w-full overflow-hidden bg-white font-sans relative');

type TasksPageProps = Omit<React.ComponentProps<'div'>, 'children'> & VariantProps<typeof taskPageVariants> & {};

export default function TasksPage({ className, ...props }: TasksPageProps) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);

  const { data: tasks } = useTasks();
  const { data: taskLists } = useTaskLists();
  const createTask = useCreateTask();
  const completeTask = useCompleteTask();
  const uncompleteTask = useUncompleteTask();

  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);

  // [추가] Task 상세 정보 수정 모드를 관리하는 상태
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  // [추가] 수정 중인 제목과 설명을 임시로 저장하는 상태
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDesc, setEditingDesc] = useState('');

  const [isAdding, setIsAdding] = useState(false);
  const [isAddingList, setIsAddingList] = useState(false);
  const [isAddingSubTask, setIsAddingSubTask] = useState(false);

  const [isLeftSideMenuVisible, setIsLeftSideMenuVisible] = useState(true);
  const [isRightSideMenuVisible, setIsRightSideMenuVisible] = useState(false);

  // Pagination 상태 관리
  const [showNotYetPagination, setShowNotYetPagination] = useState(false);
  const [showDonePagination, setShowDonePagination] = useState(false);

  // 현재 활성화된 pagination view 확인
  const isPaginationViewActive = showNotYetPagination || showDonePagination;
  const activeCategory = showNotYetPagination ? 'NOT YET' : showDonePagination ? 'DONE' : null;

  const notYetTasks =
    tasks
      ?.filter((task) => !task.completed)
      .sort((a, b) => {
        const dateA = a.createDate ? new Date(a.createDate).getTime() : 0;
        const dateB = b.createDate ? new Date(b.createDate).getTime() : 0;
        return dateB - dateA;
      }) ?? [];
  const doneTasks =
    tasks
      ?.filter((task) => task.completed)
      .sort((a, b) => {
        const dateA = a.createDate ? new Date(a.createDate).getTime() : 0;
        const dateB = b.createDate ? new Date(b.createDate).getTime() : 0;
        return dateB - dateA;
      }) ?? [];

  const handleStatusChange = (id: number) => {
    const task = tasks?.find((task) => task.id === id);
    if (task) {
      if (task.completed) {
        uncompleteTask.mutate(id);
      } else {
        completeTask.mutate(id);
      }
    }
  };

  const handleAddTask = (title: string) => {
    if (title) {
      createTask.mutate({
        title,
        dueDate: new Date().toISOString().slice(0, 10),
      });
    }
    setIsAdding(false);
  };

  const handleShowMoreNotYet = () => {
    setShowNotYetPagination(true);
  };

  const handleShowMoreDone = () => {
    setShowDonePagination(true);
  };

  const handleBackToList = () => {
    setShowNotYetPagination(false);
    setShowDonePagination(false);
  };

  useEffect(() => {
    if (selectedTask) {
      setIsRightSideMenuVisible(true);
    }
  }, [selectedTask]);

  if (!isAuth) {
    return <Navigate to={LOG_IN_PAGE} />;
  }

  return (
    <PageLayout {...props}>
      <TasksLayout>
        <div className={cn(taskPageVariants(), className)} {...props}>
          <TaskLeftSideMenu
            show={isLeftSideMenuVisible}
            hide={setIsLeftSideMenuVisible}
            lists={taskLists || []}
            isAddingList={isAddingList}
            setIsAddingList={setIsAddingList}
          />

          <div className="min-w-0 flex-1 overflow-y-auto p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!isLeftSideMenuVisible && !isPaginationViewActive && (
                  <Button variant="ghost" size="icon" onClick={() => setIsLeftSideMenuVisible(true)}>
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                )}
                {isPaginationViewActive && (
                  <Button variant="ghost" size="icon" onClick={handleBackToList}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <Heading as="h1">
                  {isPaginationViewActive ? `${activeCategory} Tasks` : 'What should I do TODAY?'}
                </Heading>
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                {!isPaginationViewActive && (
                  <Button variant="ghost" onClick={() => setIsAdding(true)}>
                    <Plus className="h-4 w-4" />
                    Add New Task
                  </Button>
                )}
                {!isRightSideMenuVisible && (
                  <Button variant="ghost" size="icon" onClick={() => setIsRightSideMenuVisible(true)}>
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* List View - 두 카테고리 모두 표시 */}
            {!isPaginationViewActive && (
              <>
                <div>
                  <Text as="small" className="font-semibold text-gray-400">
                    NOT YET
                  </Text>
                  <div className="mt-3 space-y-1">
                    {isAdding && <NewTaskInput onAddTask={handleAddTask} />}
                    {notYetTasks.slice(0, 5).map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onSelectTask={setSelectedTask}
                      />
                    ))}
                    {notYetTasks.length > 5 && (
                      <div className="flex w-full items-center justify-center">
                        <Button
                          variant="ghost"
                          className="mt-2 ml-2 text-sm text-gray-500 hover:text-gray-800"
                          onClick={handleShowMoreNotYet}
                        >
                          see more
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                <section>
                  <Text as="small" className="font-semibold text-gray-400">
                    DONE
                  </Text>
                  <div className="mt-3 space-y-1">
                    {doneTasks.slice(0, 5).map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onSelectTask={setSelectedTask}
                      />
                    ))}
                    {doneTasks.length > 5 && (
                      <div className="flex w-full items-center justify-center">
                        <Button
                          variant="ghost"
                          className="mt-2 ml-2 text-sm text-gray-500 hover:text-gray-800"
                          onClick={handleShowMoreDone}
                        >
                          see more
                        </Button>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}

            {/* Pagination View - 선택된 카테고리만 표시 */}
            {isPaginationViewActive && (
              <div>
                <Text as="small" className="font-semibold text-gray-400">
                  {activeCategory}
                </Text>
                <div className="mt-3">
                  <TaskPagination
                    tasks={showNotYetPagination ? notYetTasks : doneTasks}
                    onStatusChange={handleStatusChange}
                    onSelectTask={setSelectedTask}
                    itemsPerPage={10}
                  />
                </div>
              </div>
            )}
          </div>

          <TaskRightSideMenu
            show={isRightSideMenuVisible}
            hide={setIsRightSideMenuVisible}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            lists={taskLists || []}
            isAddingSubTask={isAddingSubTask}
            setIsAddingSubTask={setIsAddingSubTask}
            isEditingTitle={isEditingTitle}
            setIsEditingTitle={setIsEditingTitle}
            isEditingDescription={isEditingDescription}
            setIsEditingDescription={setIsEditingDescription}
            editingTitle={editingTitle}
            setEditingTitle={setEditingTitle}
            editingDesc={editingDesc}
            setEditingDesc={setEditingDesc}
          />
        </div>
      </TasksLayout>
    </PageLayout>
  );
}
