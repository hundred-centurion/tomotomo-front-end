import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useState } from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import TasksLayout from '@/components/layouts/tasks-layout.tsx';
import { Button } from '@/shadcn/button.tsx';
import TaskItem, { type Task } from '@/components/task-item.tsx';
import { cn } from '@/lib/utils.ts';
import { ChevronsLeft, ChevronsRight, Plus } from 'lucide-react';
import NewTaskInput from '@/components/new-task-input.tsx';
import { Separator } from '@/shadcn/separator.tsx';
import TaskLeftSideMenu, { type TaskList } from '@/components/task-left-side-menu.tsx';
import TaskRightSideMenu from '@/components/task-right-side-menu.tsx';
import { Heading, Text } from '@/components/typography.tsx';

const taskPageVariants = cva('flex h-screen w-full overflow-hidden bg-white font-sans relative');

type TasksPageProps = Omit<React.ComponentProps<'div'>, 'children'> & VariantProps<typeof taskPageVariants> & {};

const initialTasks: Task[] = [
  {
    id: 1,
    title: '디자인 시스템 회의 준비',
    status: 'NOT YET',
    dueDate: '25-09-15',
    list: 'Work',
    color: 'bg-orange-500',
  },
  { id: 2, title: '주간 보고서 작성', status: 'NOT YET', dueDate: '25-09-13', list: 'Work', color: 'bg-orange-500' },
  {
    id: 3,
    title: 'React 스터디 자료 읽기',
    status: 'NOT YET',
    dueDate: '25-09-14',
    list: 'Personal',
    color: 'bg-red-500',
  },
  { id: 4, title: '운동하기 - 하체', status: 'NOT YET', dueDate: '25-09-12', list: 'Personal', color: 'bg-red-500' },
  { id: 5, title: '저녁 장보기', status: 'NOT YET', dueDate: '25-09-12', list: 'My List', color: 'bg-sky-500' },
  { id: 6, title: '1분기 회고록 작성 완료', status: 'DONE', dueDate: '25-03-01', list: 'Work', color: 'bg-orange-500' },
  { id: 7, title: 'Side Project 배포', status: 'DONE', dueDate: '25-02-20', list: 'Personal', color: 'bg-red-500' },
];

const initialLists: TaskList[] = [
  { name: 'My List', count: 1, color: 'bg-sky-500' },
  { name: 'Personal', count: 3, color: 'bg-red-500' },
  { name: 'Work', count: 3, color: 'bg-orange-500' },
  { name: 'List 1', count: 0, color: 'bg-gray-300' },
];

export default function TasksPage({ className, ...props }: TasksPageProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [lists, setLists] = useState<TaskList[]>(initialLists);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(tasks[0]);
  const [isAdding, setIsAdding] = useState(false);

  const [isLeftSideMenuVisible, setIsLeftSideMenuVisible] = useState(true);
  const [isRightSideMenuVisible, setIsRightSideMenuVisible] = useState(true);

  const notYetTasks = tasks.filter((task) => task.status === 'NOT YET');
  const doneTasks = tasks.filter((task) => task.status === 'DONE');

  const handleStatusChange = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: task.status === 'NOT YET' ? 'DONE' : 'NOT YET' } : task,
      ),
    );
  };

  const handleAddTask = (title: string) => {
    if (title) {
      const newTask: Task = {
        id: Date.now(),
        title,
        status: 'NOT YET',
        dueDate: new Date().toISOString().slice(0, 7).replace('-', '-') + '-01',
        list: 'My List',
        color: 'bg-sky-500',
      };
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    }
    setIsAdding(false);
  };

  return (
    <PageLayout {...props}>
      <TasksLayout>
        <div className={cn(taskPageVariants(), className)} {...props}>
          <TaskLeftSideMenu show={isLeftSideMenuVisible} hide={setIsLeftSideMenuVisible} lists={lists} />

          <div className="min-w-0 flex-1 overflow-y-auto p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!isLeftSideMenuVisible && (
                  <Button variant="ghost" size="icon" onClick={() => setIsLeftSideMenuVisible(true)}>
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                )}
                <Heading as="h2">What should I do TODAY?</Heading>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setIsAdding(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Task
                </Button>
                {!isRightSideMenuVisible && (
                  <Button variant="ghost" size="icon" onClick={() => setIsRightSideMenuVisible(true)}>
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <Text as="small" className="font-semibold text-gray-400">
                NOT YET
              </Text>
              <div className="space-y-1">
                {isAdding && <NewTaskInput onAddTask={handleAddTask} />}
                {notYetTasks.slice(0, 5).map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onSelectTask={setSelectedTask}
                  />
                ))}
              </div>
              {notYetTasks.length > 5 && (
                <Button variant="ghost" className="mt-2 ml-2 text-sm text-gray-500 hover:text-gray-800">
                  see more
                </Button>
              )}
            </div>

            <Separator className="my-6" />

            <section>
              <Text as="small" className="font-semibold text-gray-400">
                DONE
              </Text>
              <div className="space-y-1">
                {doneTasks.slice(0, 5).map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onSelectTask={setSelectedTask}
                  />
                ))}
              </div>
              {doneTasks.length > 5 && (
                <Button variant="ghost" className="mt-2 ml-2 text-sm text-gray-500 hover:text-gray-800">
                  see more
                </Button>
              )}
            </section>
          </div>

          <TaskRightSideMenu
            show={isRightSideMenuVisible}
            hide={setIsRightSideMenuVisible}
            selectedTask={selectedTask}
          />
        </div>
      </TasksLayout>
    </PageLayout>
  );
}
