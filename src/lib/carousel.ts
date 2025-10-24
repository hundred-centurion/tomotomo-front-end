const SRC_BASE_URL = '/images/carousel';

export type Carousel = {
  type: 'post' | 'reel';
  src: string;
  href: string;
};

export const CAROUSEL_DATA: Carousel[] = [
  {
    type: 'reel',
    src: `${SRC_BASE_URL}/4.jpg`,
    href: 'https://www.instagram.com/p/DP0jF0ckeia/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    type: 'post',
    src: `${SRC_BASE_URL}/3.jpg`,
    href: 'https://www.instagram.com/p/DQEUtlrEeQ9/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    type: 'reel',
    src: `${SRC_BASE_URL}/2.jpg`,
    href: 'https://www.instagram.com/reel/DP0kq4IEZK2/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    type: 'post',
    src: `${SRC_BASE_URL}/1.jpg`,
    href: 'https://www.instagram.com/p/DP0jF0ckeia/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
];
