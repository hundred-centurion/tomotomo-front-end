import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import { useTaskStore } from '@/store/task-store.ts';
import type { Create3, Update4, TaskResponse, ResponseEntityBaseResponseVoid } from '@/services/.api.ts';

export function useTasks() {
  const { setTasks, setLoading, setError } = useTaskStore();

  return useQuery<TaskResponse[], Error>({
    queryKey: ['tasks'],
    queryFn: async () => {
      setLoading(true);
      try {
        const res = await api.api.tasksList();
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || '할 일 조회 실패');
        }
        setTasks(res.data.data);
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

export function useTasksByList(taskListId: number) {
  const { setTasks, setLoading, setError } = useTaskStore();

  return useQuery<TaskResponse[], Error>({
    queryKey: ['tasks', 'list', taskListId],
    queryFn: async () => {
      setLoading(true);
      try {
        const res = await api.api.tasksListDetail(taskListId);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || 'TaskList별 할 일 조회 실패');
        }
        setTasks(res.data.data);
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!taskListId,
  });
}

export function useIncompleteTasks(taskListId: number) {
  const { setTasks, setLoading, setError } = useTaskStore();

  return useQuery<TaskResponse[], Error>({
    queryKey: ['tasks', 'incomplete', taskListId],
    queryFn: async () => {
      setLoading(true);
      try {
        const res = await api.api.tasksListIncompleteList(taskListId);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || '미완료 할 일 조회 실패');
        }
        setTasks(res.data.data);
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!taskListId,
  });
}

export function useCompletedTasks(taskListId: number) {
  const { setTasks, setLoading, setError } = useTaskStore();

  return useQuery<TaskResponse[], Error>({
    queryKey: ['tasks', 'completed', taskListId],
    queryFn: async () => {
      setLoading(true);
      try {
        const res = await api.api.tasksListCompletedList(taskListId);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || '완료된 할 일 조회 실패');
        }
        setTasks(res.data.data);
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!taskListId,
  });
}

export function useIncompleteTaskCount(taskListId: number) {
  return useQuery<number | undefined, Error>({
    queryKey: ['tasks', 'incomplete-count', taskListId],
    queryFn: async () => {
      const res = await api.api.tasksListIncompleteCountList(taskListId);
      if (!res.data?.success) {
        throw new Error(res.data?.error || '미완료 할 일 개수 조회 실패');
      }
      return res.data.data;
    },
    enabled: !!taskListId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { addTask, setCreating, setError } = useTaskStore();

  return useMutation<TaskResponse, Error, Create3>({
    mutationFn: async (data: Create3) => {
      setCreating(true);
      try {
        const res = await api.api.tasksCreate(data);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || '할 일 생성 실패');
        }
        addTask(res.data.data);
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setCreating(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { updateTask, setUpdating, setError } = useTaskStore();

  return useMutation<TaskResponse, Error, { taskId: number; data: Update4 }>({
    mutationFn: async ({ taskId, data }: { taskId: number; data: Update4 }) => {
      setUpdating(true);
      try {
        const res = await api.api.tasksUpdateCreate(taskId, data);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || '할 일 수정 실패');
        }
        updateTask(taskId, res.data.data);
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setUpdating(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  const { toggleTaskCompletion, setUpdating, setError } = useTaskStore();

  return useMutation<TaskResponse, Error, number>({
    mutationFn: async (taskId: number) => {
      setUpdating(true);
      try {
        const res = await api.api.tasksCompleteCreate(taskId);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || '할 일 완료 처리 실패');
        }
        toggleTaskCompletion(taskId);
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setUpdating(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
    },
  });
}

export function useUncompleteTask() {
  const queryClient = useQueryClient();
  const { toggleTaskCompletion, setUpdating, setError } = useTaskStore();

  return useMutation<TaskResponse, Error, number>({
    mutationFn: async (taskId: number) => {
      setUpdating(true);
      try {
        const res = await api.api.tasksUncompleteCreate(taskId);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || '할 일 완료 취소 실패');
        }
        toggleTaskCompletion(taskId);
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setUpdating(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { removeTask, setDeleting, setError } = useTaskStore();

  return useMutation<ResponseEntityBaseResponseVoid, Error, number>({
    mutationFn: async (taskId: number) => {
      setDeleting(true);
      try {
        const res = await api.api.tasksDeleteCreate(taskId);
        if (!res.data?.success) {
          throw new Error(res.data?.error || '할 일 삭제 실패');
        }
        removeTask(taskId);
        return res.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setDeleting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
    },
  });
}