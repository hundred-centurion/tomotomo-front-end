import { create } from 'zustand';
import type { SubTaskResponse } from '@/services/.api.ts';

type SubtaskState = {
  // Subtasks by task ID
  subtasks: Record<number, SubTaskResponse[]>;

  // Current subtask
  currentSubtask: SubTaskResponse | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Error state
  error: string | null;

  // Actions
  setSubtasks: (taskId: number, subtasks: SubTaskResponse[]) => void;
  setCurrentSubtask: (subtask: SubTaskResponse | null) => void;
  addSubtask: (taskId: number, subtask: SubTaskResponse) => void;
  updateSubtask: (taskId: number, subtaskId: number, updatedSubtask: SubTaskResponse) => void;
  removeSubtask: (taskId: number, subtaskId: number) => void;
  toggleSubtaskCompletion: (taskId: number, subtaskId: number) => void;

  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setDeleting: (deleting: boolean) => void;
  setError: (error: string | null) => void;

  clearError: () => void;
  reset: () => void;
};

export const useSubtaskStore = create<SubtaskState>((set) => ({
  // Initial state
  subtasks: {},
  currentSubtask: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,

  // Subtasks actions
  setSubtasks: (taskId, subtasks) =>
    set((state) => ({
      subtasks: {
        ...state.subtasks,
        [taskId]: subtasks,
      },
    })),

  setCurrentSubtask: (subtask) => set({ currentSubtask: subtask }),

  addSubtask: (taskId, subtask) =>
    set((state) => ({
      subtasks: {
        ...state.subtasks,
        [taskId]: [...(state.subtasks[taskId] || []), subtask],
      },
    })),

  updateSubtask: (taskId, subtaskId, updatedSubtask) =>
    set((state) => ({
      subtasks: {
        ...state.subtasks,
        [taskId]: (state.subtasks[taskId] || []).map((subtask) =>
          subtask.id === subtaskId ? updatedSubtask : subtask,
        ),
      },
      currentSubtask: state.currentSubtask?.id === subtaskId ? updatedSubtask : state.currentSubtask,
    })),

  removeSubtask: (taskId, subtaskId) =>
    set((state) => ({
      subtasks: {
        ...state.subtasks,
        [taskId]: (state.subtasks[taskId] || []).filter((subtask) => subtask.id !== subtaskId),
      },
      currentSubtask: state.currentSubtask?.id === subtaskId ? null : state.currentSubtask,
    })),

  toggleSubtaskCompletion: (taskId, subtaskId) =>
    set((state) => ({
      subtasks: {
        ...state.subtasks,
        [taskId]: (state.subtasks[taskId] || []).map((subtask) =>
          subtask.id === subtaskId ? { ...subtask, isCompleted: !subtask.isCompleted } : subtask,
        ),
      },
      currentSubtask:
        state.currentSubtask?.id === subtaskId
          ? { ...state.currentSubtask, isCompleted: !state.currentSubtask.isCompleted }
          : state.currentSubtask,
    })),

  // Loading states
  setLoading: (loading) => set({ isLoading: loading }),
  setCreating: (creating) => set({ isCreating: creating }),
  setUpdating: (updating) => set({ isUpdating: updating }),
  setDeleting: (deleting) => set({ isDeleting: deleting }),
  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      subtasks: {},
      currentSubtask: null,
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      error: null,
    }),
}));
