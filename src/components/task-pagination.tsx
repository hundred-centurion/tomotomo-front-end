import * as React from 'react';
import { Button } from '@/shadcn/button.tsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TaskItem from '@/components/task-item.tsx';
import type { TaskResponse } from '@/services/api.ts';

interface TaskPaginationProps {
  tasks: TaskResponse[];
  onStatusChange: (id: number) => void;
  onSelectTask: (task: TaskResponse) => void;
  itemsPerPage?: number;
}

export default function TaskPagination({ tasks, onStatusChange, onSelectTask, itemsPerPage = 5 }: TaskPaginationProps) {
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTasks = tasks.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Task List */}
      <div className="space-y-1">
        {currentTasks.map((task) => (
          <TaskItem key={task.id} task={task} onStatusChange={onStatusChange} onSelectTask={onSelectTask} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {(() => {
              const pages = [];

              // Always show first 3 pages if total pages >= 3
              if (totalPages >= 3) {
                for (let i = 1; i <= 3; i++) {
                  const isActive = i === currentPage;
                  pages.push(
                    <Button
                      key={i}
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(i)}
                      className={`h-8 w-8 p-0 text-sm ${
                        isActive ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {i}
                    </Button>,
                  );
                }

                // Show ellipsis if there are more than 3 pages
                if (totalPages > 3) {
                  pages.push(
                    <span key="ellipsis" className="text-gray-400">
                      ...
                    </span>,
                  );
                }
              } else {
                // Show all pages if less than 3
                for (let i = 1; i <= totalPages; i++) {
                  const isActive = i === currentPage;
                  pages.push(
                    <Button
                      key={i}
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(i)}
                      className={`h-8 w-8 p-0 text-sm ${
                        isActive ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {i}
                    </Button>,
                  );
                }
              }

              return pages;
            })()}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="text-gray-600 hover:text-gray-800"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
