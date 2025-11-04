const SRC_BASE_URL = '/images/carousel';

export type Carousel = {
  type: 'post' | 'reel';
  src: string;
  href: string;
};

export const CAROUSEL_DATA: Carousel[] = [
  {
    type: 'post',
    src: `${SRC_BASE_URL}/9.jpg`,
    href: 'https://www.instagram.com/p/DQoTprIEfWp',
  },
  {
    type: 'post',
    src: `${SRC_BASE_URL}/8.jpg`,
    href: 'https://www.instagram.com/p/DQjV37UCW-r',
  },
  {
    type: 'reel',
    src: `${SRC_BASE_URL}/7.jpg`,
    href: 'https://www.instagram.com/reel/DQY1_kwkW_A',
  },
  {
    type: 'post',
    src: `${SRC_BASE_URL}/6.jpg`,
    href: 'https://www.instagram.com/p/DQV_js9EWJW',
  },
  {
    type: 'post',
    src: `${SRC_BASE_URL}/5.jpg`,
    href: 'https://www.instagram.com/p/DQMaVLhiQmf',
  },
  {
    type: 'reel',
    src: `${SRC_BASE_URL}/4.jpg`,
    href: 'https://www.instagram.com/reel/DQG1ll7kSPb',
  },
  {
    type: 'post',
    src: `${SRC_BASE_URL}/3.jpg`,
    href: 'https://www.instagram.com/p/DQEUtlrEeQ9',
  },
  {
    type: 'reel',
    src: `${SRC_BASE_URL}/2.jpg`,
    href: 'https://www.instagram.com/reel/DP0kq4IEZK2',
  },
  {
    type: 'post',
    src: `${SRC_BASE_URL}/1.jpg`,
    href: 'https://www.instagram.com/p/DP0jF0ckeia',
  },
];
