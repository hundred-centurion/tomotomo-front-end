import { create } from 'zustand';
import type {
  TimerResponse,
  UserAnalysisReportResponse,
  TimerDashboardStatsResponse,
  MonthlyDashboardStatsResponse,
} from '@/services/api.ts';

type TimerState = {
  // Timer records
  timerHistory: TimerResponse[];
  currentTimer: TimerResponse | null;

  // Statistics
  timerStats: TimerDashboardStatsResponse | null;
  monthlyStats: MonthlyDashboardStatsResponse | null;
  analysisReport: UserAnalysisReportResponse | null;

  // Loading states
  isLoading: boolean;
  isStarting: boolean;
  isCompleting: boolean;
  isStatsLoading: boolean;
  isDownloading: boolean;

  // Error state
  error: string | null;

  // Header visibility state
  isHeaderVisible: boolean;
  isHeaderHovered: boolean;

  // Actions
  setTimerHistory: (history: TimerResponse[]) => void;
  setCurrentTimer: (timer: TimerResponse | null) => void;
  addTimerRecord: (timer: TimerResponse) => void;
  updateTimerRecord: (timerId: number, updatedTimer: TimerResponse) => void;
  removeTimerRecord: (timerId: number) => void;

  setTimerStats: (stats: TimerDashboardStatsResponse | null) => void;
  setMonthlyStats: (stats: MonthlyDashboardStatsResponse | null) => void;
  setAnalysisReport: (report: UserAnalysisReportResponse | null) => void;

  setLoading: (loading: boolean) => void;
  setStarting: (starting: boolean) => void;
  setCompleting: (completing: boolean) => void;
  setStatsLoading: (loading: boolean) => void;
  setDownloading: (downloading: boolean) => void;
  setError: (error: string | null) => void;

  // Header actions
  setHeaderVisible: (visible: boolean) => void;
  setHeaderHovered: (hovered: boolean) => void;

  clearError: () => void;
  reset: () => void;
};

export const useTimerStore = create<TimerState>((set) => ({
  // Initial state
  timerHistory: [],
  currentTimer: null,
  timerStats: null,
  monthlyStats: null,
  analysisReport: null,
  isLoading: false,
  isStarting: false,
  isCompleting: false,
  isStatsLoading: false,
  isDownloading: false,
  error: null,
  isHeaderVisible: true,
  isHeaderHovered: false,

  // Timer records actions
  setTimerHistory: (history) => set({ timerHistory: history }),

  setCurrentTimer: (timer) => set({ currentTimer: timer }),

  addTimerRecord: (timer) =>
    set((state) => ({
      timerHistory: [timer, ...state.timerHistory],
    })),

  updateTimerRecord: (timerId, updatedTimer) =>
    set((state) => ({
      timerHistory: state.timerHistory.map((timer) => (timer.id === timerId ? updatedTimer : timer)),
      currentTimer: state.currentTimer?.id === timerId ? updatedTimer : state.currentTimer,
    })),

  removeTimerRecord: (timerId) =>
    set((state) => ({
      timerHistory: state.timerHistory.filter((timer) => timer.id !== timerId),
      currentTimer: state.currentTimer?.id === timerId ? null : state.currentTimer,
    })),

  // Statistics actions
  setTimerStats: (stats) => set({ timerStats: stats }),
  setMonthlyStats: (stats) => set({ monthlyStats: stats }),
  setAnalysisReport: (report) => set({ analysisReport: report }),

  // Loading states
  setLoading: (loading) => set({ isLoading: loading }),
  setStarting: (starting) => set({ isStarting: starting }),
  setCompleting: (completing) => set({ isCompleting: completing }),
  setStatsLoading: (loading) => set({ isStatsLoading: loading }),
  setDownloading: (downloading) => set({ isDownloading: downloading }),
  setError: (error) => set({ error }),

  // Header actions
  setHeaderVisible: (visible) => set({ isHeaderVisible: visible }),
  setHeaderHovered: (hovered) => set({ isHeaderHovered: hovered }),

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      timerHistory: [],
      currentTimer: null,
      timerStats: null,
      monthlyStats: null,
      analysisReport: null,
      isLoading: false,
      isStarting: false,
      isCompleting: false,
      isStatsLoading: false,
      isDownloading: false,
      error: null,
      isHeaderVisible: true,
      isHeaderHovered: false,
    }),
}));
