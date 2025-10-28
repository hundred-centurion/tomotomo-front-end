import { create } from 'zustand';

const TUTORIAL_VISIBLE_KEY = 'tutorial-visible';

type UIStore = {
  tutorialDialogVisible: boolean;

  openTutorialDialog: () => void;
  hideTutorialDialog: () => void;
};

// localStorage에서 tutorial을 본 적이 있는지 확인
export const hasSeenTutorial = () => {
  return localStorage.getItem(TUTORIAL_VISIBLE_KEY) === 'true';
};

export const useUIStore = create<UIStore>((set) => ({
  // localStorage에 저장된 값이 없으면 true (처음 방문), 있으면 false
  tutorialDialogVisible: false,

  openTutorialDialog: () =>
    set(() => ({
      tutorialDialogVisible: true,
    })),
  hideTutorialDialog: () => {
    localStorage.setItem(TUTORIAL_VISIBLE_KEY, 'true');
    set(() => ({
      tutorialDialogVisible: false,
    }));
  },
}));
