import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import HomeLayout from '@/components/layouts/home-layout.tsx';
import { CAROUSEL_DATA } from '@/lib/carousel';
import { Heading, Text } from '@/components/typography.tsx';
import { FAQ } from '@/lib/faq.ts';
import Collapse from '@/components/collapse.tsx';
import Carousel from '@/components/carousel.tsx';

type IndexPageProps = Omit<React.ComponentProps<'div'>, 'children'> & {};

export default function IndexPage({ ...props }: IndexPageProps) {
  return (
    <PageLayout {...props}>
      <div className="mb-[60px] w-full">
        <div className="mx-auto w-full max-w-[1100px] pt-[37px]">
          <Heading className="mb-8">Today’s TOPIC</Heading>

          <div className="mb-2 px-2">
            <div className="flex items-center">
              <img src="/images/instagram.svg" alt="instagram icon" className="mr-1 h-3 w-3" />
              <a href="https://www.instagram.com/tomotomo_4u" target="_blank" className="flex h-3 items-center">
                <Text className="inline-block text-xs font-semibold text-[#515151]">@tomotomo_4u</Text>
              </a>
            </div>
          </div>
        </div>

        <Carousel>
          {[...CAROUSEL_DATA, ...CAROUSEL_DATA, ...CAROUSEL_DATA].map(({ type, file, href }, index) => (
            <div
              key={index}
              className="relative h-full w-full cursor-pointer rounded-lg bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${file})` }}
              onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
            >
              <img
                src={type === 'post' ? '/images/post.svg' : '/images/reel.svg'}
                alt="icon"
                className="absolute right-3 bottom-3"
              />
            </div>
          ))}
        </Carousel>
      </div>

      <HomeLayout className="w-full max-w-[1100px]">
        <div className="w-full">
          <div className="flex items-baseline gap-6">
            <Heading>FAQ</Heading>
            <div className="h-[1px] w-full bg-black" />
          </div>

          <div className="mx-auto w-full max-w-[1050px]">
            {FAQ.map(({ title, content }, index) => (
              <div key={index} className="not-first-of-type:mt-4 first-of-type:mt-10">
                <Collapse title={title} content={content} />
              </div>
            ))}
          </div>
        </div>
      </HomeLayout>
    </PageLayout>
  );
}
