import { readdirSync } from 'fs';
import { HtmlTagDescriptor } from 'vite';

const pretendard = readdirSync('./public/fonts').filter((file) => file.endsWith('.woff2'));

export const injectFontsToHead: HtmlTagDescriptor[] = [
  ...pretendard.map(
    (fontFile) =>
      ({
        injectTo: 'head',
        tag: 'link',
        attrs: {
          rel: 'preload',
          href: `/fonts/${fontFile}`,
          as: 'font',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
        },
      }) as HtmlTagDescriptor,
  ),
];
