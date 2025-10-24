const TUTORIAL_SRC_BASE_URL = '/images/tutorial';
const TUTORIAL_SRC_FILE_NAME = 'tutorial';

type TutorialData = {
  src: string;
};

export const TUTORIAL_DATA: TutorialData[] = [
  {
    src: `${TUTORIAL_SRC_BASE_URL}/${TUTORIAL_SRC_FILE_NAME}-1.png`,
  },
  {
    src: `${TUTORIAL_SRC_BASE_URL}/${TUTORIAL_SRC_FILE_NAME}-2.png`,
  },
  {
    src: `${TUTORIAL_SRC_BASE_URL}/${TUTORIAL_SRC_FILE_NAME}-3.png`,
  },
  {
    src: `${TUTORIAL_SRC_BASE_URL}/${TUTORIAL_SRC_FILE_NAME}-4.png`,
  },
];
