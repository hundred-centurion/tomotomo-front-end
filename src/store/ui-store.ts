import { create } from 'zustand';

const TUTORIAL_VISIBLE_KEY = 'tutorial-visible';

type UIStore = {
  tutorialDialogVisible: boolean;

  openTutorialDialog: () => void;
  hideTutorialDialog: () => void;
};

// localStorage에서 tutorial을 본 적이 있는지 확인
const hasSeenTutorial = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(TUTORIAL_VISIBLE_KEY) === 'false';
};

export const useUIStore = create<UIStore>((set) => ({
  // localStorage에 저장된 값이 없으면 true (처음 방문), 있으면 false
  tutorialDialogVisible: !hasSeenTutorial(),

  openTutorialDialog: () =>
    set(() => ({
      tutorialDialogVisible: true,
    })),
  hideTutorialDialog: () => {
    // localStorage에 tutorial을 봤다고 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem(TUTORIAL_VISIBLE_KEY, 'false');
    }
    set(() => ({
      tutorialDialogVisible: false,
    }));
  },
}));
