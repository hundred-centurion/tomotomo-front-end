import { readdirSync } from 'fs';
import { HtmlTagDescriptor } from 'vite';
import { info } from '../src/lib/logger';

const pretendard = readdirSync('./public/fonts').filter((file) => file.endsWith('.woff2'));

export const injectFontsToHead = (): HtmlTagDescriptor[] => {
  info('Inject fonts to "head".');

  return [
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
};
