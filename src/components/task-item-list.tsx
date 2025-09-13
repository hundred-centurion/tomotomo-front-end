import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { Text } from '@/components/typography.tsx';
import NewTaskInput from '@/components/new-task-input.tsx';
import TaskItem, { type Task } from '@/components/task-item.tsx';
import { Button } from '@/shadcn/button.tsx';

const taskItemListVariants = cva('');

export type TaskItemListProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof taskItemListVariants> & {
    title: string;
    isAdding: boolean;
    tasks: Task[];
  };

export default function TaskItemList({ className, title, isAdding, tasks, ...props }: TaskItemListProps) {
  return (
    <div className={cn(taskItemListVariants(), className)} {...props}>
      <Text as="small" className="font-semibold text-gray-400">
        {title}
      </Text>
      <div className="space-y-1">
        {isAdding && <NewTaskInput onAddTask={handleAddTask} />}
        {tasks.slice(0, 5).map((task) => (
          <TaskItem key={task.id} task={task} onStatusChange={handleStatusChange} onSelectTask={setSelectedTask} />
        ))}
      </div>
      {tasks.length > 5 && (
        <Button variant="ghost" className="mt-2 ml-2 text-sm text-gray-500 hover:text-gray-800">
          see more
        </Button>
      )}
    </div>
  );
}
