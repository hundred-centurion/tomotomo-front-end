import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Checkbox } from '@/shadcn/checkbox.tsx';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils.ts';

const taskItemVariants = cva('group flex cursor-pointer items-center rounded-md p-2 hover:bg-gray-50');

export type TaskStatus = 'NOT YET' | 'DONE';

export type SubTask = {
  id: number;
  title: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  list: string;
  color: string;
  subTasks?: SubTask[];
};

export type TaskItemProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof taskItemVariants> & {
    task: Task;
    onStatusChange: (id: number) => void;
    onSelectTask: (task: Task) => void;
  };

export default function TaskItem({ className, task, onStatusChange, onSelectTask, ...props }: TaskItemProps) {
  return (
    <div className={cn(taskItemVariants(), className)} onClick={() => onSelectTask(task)} {...props}>
      <Checkbox checked={task.status === 'DONE'} onCheckedChange={() => onStatusChange(task.id)} className="mr-3" />
      <div className={`h-3 w-3 rounded-full ${task.color} mr-3`}></div>
      <div className="flex-grow">
        <span className={`text-sm ${task.status === 'DONE' ? 'text-gray-400 line-through' : ''}`}>
          to do : {task.title}
        </span>
        <span className="ml-2 text-xs text-gray-400">due: {task.dueDate}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-gray-600" />
    </div>
  );
}
