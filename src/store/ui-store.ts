import { create } from 'zustand';

type UIStore = {
  tutorialDialogVisible: boolean;

  openTutorialDialog: () => void;
  hideTutorialDialog: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  tutorialDialogVisible: false,

  openTutorialDialog: () =>
    set(() => ({
      tutorialDialogVisible: true,
    })),
  hideTutorialDialog: () =>
    set(() => ({
      tutorialDialogVisible: false,
    })),
}));
