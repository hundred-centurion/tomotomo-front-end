import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import { useTaskStore } from '@/store/task-store.ts';
import type { TaskListRequest, TaskListResponse, ResponseEntityBaseResponseVoid } from '@/services/api.ts';
import { useAuthStore } from '@/store';

export function useTaskLists() {
  const { setTaskLists, setLoading, setError } = useTaskStore();
  const isAuth = useAuthStore((state) => state.isAuthenticated);

  return useQuery<TaskListResponse[], Error>({
    queryKey: ['task-lists'],
    queryFn: async () => {
      if (!isAuth) {
        return;
      }

      setLoading(true);
      try {
        const res = await api.api.taskListsList();
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || 'TaskList 조회 실패');
        }
        setTaskLists(res.data.data);
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setLoading(false);
      }
    },
  });
}

export function useCreateTaskList() {
  const queryClient = useQueryClient();
  const { addTaskList, setCreating, setError } = useTaskStore();

  return useMutation<TaskListResponse, Error, TaskListRequest>({
    mutationFn: async (data: TaskListRequest) => {
      setCreating(true);
      try {
        const res = await api.api.taskListsCreate(data);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || 'TaskList 생성 실패');
        }
        addTaskList(res.data.data);
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setCreating(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
    },
  });
}

export function useUpdateTaskList() {
  const queryClient = useQueryClient();
  const { updateTaskList, setUpdating, setError } = useTaskStore();

  return useMutation<TaskListResponse, Error, { taskListId: number; data: TaskListRequest }>({
    mutationFn: async ({ taskListId, data }: { taskListId: number; data: TaskListRequest }) => {
      setUpdating(true);
      try {
        const res = await api.api.taskListsUpdateCreate(taskListId, data);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || 'TaskList 수정 실패');
        }
        updateTaskList(taskListId, res.data.data);
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setUpdating(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
    },
  });
}

export function useDeleteTaskList() {
  const queryClient = useQueryClient();
  const { removeTaskList, setDeleting, setError } = useTaskStore();

  return useMutation<ResponseEntityBaseResponseVoid, Error, number>({
    mutationFn: async (taskListId: number) => {
      setDeleting(true);
      try {
        const res = await api.api.taskListsDeleteCreate(taskListId);
        if (!res.data?.success) {
          throw new Error(res.data?.error || 'TaskList 삭제 실패');
        }
        removeTaskList(taskListId);
        return res.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setDeleting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
