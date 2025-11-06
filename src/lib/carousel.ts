const SRC_BASE_URL = '/images/carousel';

export type Carousel = {
  type: 'post' | 'reel';
  file: string;
  href: string;
};

export const CAROUSEL_DATA: Carousel[] = [
  {
    type: 'reel',
    file: '10.jpg',
    href: 'https://www.instagram.com/reel/DQqCj6ygUFs',
  },
  {
    type: 'post',
    file: '9.jpg',
    href: 'https://www.instagram.com/p/DQoTprIEfWp',
  },
  {
    type: 'post',
    file: '8.jpg',
    href: 'https://www.instagram.com/p/DQjV37UCW-r',
  },
  {
    type: 'reel',
    file: '7.jpg',
    href: 'https://www.instagram.com/reel/DQY1_kwkW_A',
  },
  {
    type: 'post',
    file: '6.jpg',
    href: 'https://www.instagram.com/p/DQV_js9EWJW',
  },
  {
    type: 'post',
    file: '5.jpg',
    href: 'https://www.instagram.com/p/DQMaVLhiQmf',
  },
  {
    type: 'reel',
    file: '4.jpg',
    href: 'https://www.instagram.com/reel/DQG1ll7kSPb',
  },
  {
    type: 'post',
    file: '3.jpg',
    href: 'https://www.instagram.com/p/DQEUtlrEeQ9',
  },
  {
    type: 'reel',
    file: '2.jpg',
    href: 'https://www.instagram.com/reel/DP0kq4IEZK2',
  },
  {
    type: 'post',
    file: '1.jpg',
    href: 'https://www.instagram.com/p/DP0jF0ckeia',
  },
].map(({ file, ...nest }) => ({ file: `${SRC_BASE_URL}/${file}`, ...nest }) as Carousel);
