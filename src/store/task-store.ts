import { create } from 'zustand';
import type { TaskResponse, TaskListResponse } from '@/services/.api.ts';

type TaskState = {
  // Task Lists
  taskLists: TaskListResponse[];
  currentTaskList: TaskListResponse | null;

  // Tasks
  tasks: TaskResponse[];
  currentTask: TaskResponse | null;

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Error state
  error: string | null;

  // Actions
  setTaskLists: (taskLists: TaskListResponse[]) => void;
  setCurrentTaskList: (taskList: TaskListResponse | null) => void;
  addTaskList: (taskList: TaskListResponse) => void;
  updateTaskList: (taskListId: number, updatedTaskList: TaskListResponse) => void;
  removeTaskList: (taskListId: number) => void;

  setTasks: (tasks: TaskResponse[]) => void;
  setCurrentTask: (task: TaskResponse | null) => void;
  addTask: (task: TaskResponse) => void;
  updateTask: (taskId: number, updatedTask: TaskResponse) => void;
  removeTask: (taskId: number) => void;
  toggleTaskCompletion: (taskId: number) => void;

  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setDeleting: (deleting: boolean) => void;
  setError: (error: string | null) => void;

  clearError: () => void;
  reset: () => void;
};

export const useTaskStore = create<TaskState>((set) => ({
  // Initial state
  taskLists: [],
  currentTaskList: null,
  tasks: [],
  currentTask: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,

  // Task Lists actions
  setTaskLists: (taskLists) => set({ taskLists }),

  setCurrentTaskList: (taskList) => set({ currentTaskList: taskList }),

  addTaskList: (taskList) =>
    set((state) => ({
      taskLists: [...state.taskLists, taskList],
    })),

  updateTaskList: (taskListId, updatedTaskList) =>
    set((state) => ({
      taskLists: state.taskLists.map((list) => (list.id === taskListId ? updatedTaskList : list)),
      currentTaskList: state.currentTaskList?.id === taskListId ? updatedTaskList : state.currentTaskList,
    })),

  removeTaskList: (taskListId) =>
    set((state) => ({
      taskLists: state.taskLists.filter((list) => list.id !== taskListId),
      currentTaskList: state.currentTaskList?.id === taskListId ? null : state.currentTaskList,
    })),

  // Tasks actions
  setTasks: (tasks) => set({ tasks }),

  setCurrentTask: (task) => set({ currentTask: task }),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (taskId, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === taskId ? updatedTask : task)),
      currentTask: state.currentTask?.id === taskId ? updatedTask : state.currentTask,
    })),

  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
      currentTask: state.currentTask?.id === taskId ? null : state.currentTask,
    })),

  toggleTaskCompletion: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task)),
      currentTask:
        state.currentTask?.id === taskId
          ? { ...state.currentTask, isCompleted: !state.currentTask.isCompleted }
          : state.currentTask,
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
      taskLists: [],
      currentTaskList: null,
      tasks: [],
      currentTask: null,
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      error: null,
    }),
}));
