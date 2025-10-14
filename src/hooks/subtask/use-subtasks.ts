import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/auth.ts';
import { useSubtaskStore } from '@/store/subtask-store.ts';
import type { Create, Update, SubTaskResponse, BaseResponseVoid } from '@/services/api.ts';

export function useSubtasksByTask(taskId: number) {
  const { setSubtasks, setLoading, setError } = useSubtaskStore();

  return useQuery<SubTaskResponse[], Error>({
    queryKey: ['subtasks', 'task', taskId],
    queryFn: async () => {
      setLoading(true);
      try {
        const res = await api.api.subtasksTaskDetail(taskId);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || '서브태스크 조회 실패');
        }
        setSubtasks(taskId, res.data.data);
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!taskId,
  });
}

export function useIncompleteSubtasks(taskId: number) {
  const { setSubtasks, setLoading, setError } = useSubtaskStore();

  return useQuery<SubTaskResponse[], Error>({
    queryKey: ['subtasks', 'incomplete', taskId],
    queryFn: async () => {
      setLoading(true);
      try {
        const res = await api.api.subtasksTaskIncompleteList(taskId);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || '미완료 서브태스크 조회 실패');
        }
        setSubtasks(taskId, res.data.data);
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!taskId,
  });
}

export function useCompletedSubtasks(taskId: number) {
  const { setSubtasks, setLoading, setError } = useSubtaskStore();

  return useQuery<SubTaskResponse[], Error>({
    queryKey: ['subtasks', 'completed', taskId],
    queryFn: async () => {
      setLoading(true);
      try {
        const res = await api.api.subtasksTaskCompletedList(taskId);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || '완료된 서브태스크 조회 실패');
        }
        setSubtasks(taskId, res.data.data);
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!taskId,
  });
}

export function useCreateSubtask() {
  const queryClient = useQueryClient();
  const { addSubtask, setCreating, setError } = useSubtaskStore();

  return useMutation<SubTaskResponse, Error, Create>({
    mutationFn: async (data: Create) => {
      setCreating(true);
      try {
        const res = await api.api.subtasksCreate(data);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || '서브태스크 생성 실패');
        }
        addSubtask(data.taskId, res.data.data);
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setCreating(false);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subtasks', 'task', data.taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
    },
  });
}

export function useUpdateSubtask() {
  const queryClient = useQueryClient();
  const { updateSubtask, setUpdating, setError } = useSubtaskStore();

  return useMutation<SubTaskResponse, Error, { subTaskId: number; data: Update }>({
    mutationFn: async ({ subTaskId, data }: { subTaskId: number; data: Update }) => {
      setUpdating(true);
      try {
        const res = await api.api.subtasksUpdateCreate(subTaskId, data);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || '서브태스크 수정 실패');
        }
        // taskId를 찾기 위해 현재 subtask 정보를 사용
        const currentSubtask = useSubtaskStore.getState().currentSubtask;
        if (currentSubtask?.taskId) {
          updateSubtask(currentSubtask.taskId, subTaskId, res.data.data);
        }
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setUpdating(false);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subtasks', 'task', data.taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
    },
  });
}

export function useCompleteSubtask() {
  const queryClient = useQueryClient();
  const { toggleSubtaskCompletion, setUpdating, setError } = useSubtaskStore();

  return useMutation<SubTaskResponse, Error, number>({
    mutationFn: async (subTaskId: number) => {
      setUpdating(true);
      try {
        const res = await api.api.subtasksCompleteCreate(subTaskId);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || '서브태스크 완료 처리 실패');
        }
        // taskId를 찾기 위해 현재 subtask 정보를 사용
        const currentSubtask = useSubtaskStore.getState().currentSubtask;
        if (currentSubtask?.taskId) {
          toggleSubtaskCompletion(currentSubtask.taskId, subTaskId);
        }
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setUpdating(false);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subtasks', 'task', data.taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
    },
  });
}

export function useUncompleteSubtask() {
  const queryClient = useQueryClient();
  const { toggleSubtaskCompletion, setUpdating, setError } = useSubtaskStore();

  return useMutation<SubTaskResponse, Error, number>({
    mutationFn: async (subTaskId: number) => {
      setUpdating(true);
      try {
        const res = await api.api.subtasksUncompleteCreate(subTaskId);
        if (!res.data?.success || !res.data.data) {
          throw new Error(res.data?.error || '서브태스크 완료 취소 실패');
        }
        // taskId를 찾기 위해 현재 subtask 정보를 사용
        const currentSubtask = useSubtaskStore.getState().currentSubtask;
        if (currentSubtask?.taskId) {
          toggleSubtaskCompletion(currentSubtask.taskId, subTaskId);
        }
        return res.data.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setUpdating(false);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subtasks', 'task', data.taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
    },
  });
}

export function useDeleteSubtask() {
  const queryClient = useQueryClient();
  const { removeSubtask, setDeleting, setError } = useSubtaskStore();

  return useMutation<BaseResponseVoid, Error, number>({
    mutationFn: async (subTaskId: number) => {
      setDeleting(true);
      try {
        const res = await api.api.subtasksDeleteCreate(subTaskId);
        if (!res.data?.success) {
          throw new Error(res.data?.error || '서브태스크 삭제 실패');
        }
        // taskId를 찾기 위해 현재 subtask 정보를 사용
        const currentSubtask = useSubtaskStore.getState().currentSubtask;
        if (currentSubtask?.taskId) {
          removeSubtask(currentSubtask.taskId, subTaskId);
        }
        return res.data;
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        throw error;
      } finally {
        setDeleting(false);
      }
    },
    onSuccess: () => {
      // 모든 subtask 쿼리를 무효화
      queryClient.invalidateQueries({ queryKey: ['subtasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-lists'] });
    },
  });
}
