import { createFileRoute } from '@tanstack/react-router';
import TodoLayout from '@/components/layouts/todo-layout.tsx';

const TodoLayoutComponent = () => {
  return (
    <TodoLayout>
      <span>Todo</span>
    </TodoLayout>
  );
};

export const Route = createFileRoute('/todo')({
  component: TodoLayoutComponent,
});
