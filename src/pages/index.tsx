import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import HomeLayout from '@/components/layouts/home-layout.tsx';
import InfiniteCarousel from '@/components/infinite-carousel.tsx';
import { CAROUSEL_DATA } from '@/lib/carousel';
import { Link } from '@tanstack/react-router';
import { Heading } from '@/components/typography.tsx';
import { FAQ } from '@/lib/faq.ts';
import Collapse from '@/components/collapse.tsx';

type IndexPageProps = Omit<React.ComponentProps<'div'>, 'children'> & {};

export default function IndexPage({ ...props }: IndexPageProps) {
  return (
    <PageLayout {...props}>
      <HomeLayout>
        <div>
          <InfiniteCarousel>
            {CAROUSEL_DATA.map(({ type, src, href }) => (
              <a className="h-full w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: src }}>
                s
              </a>
            ))}
          </InfiniteCarousel>
        </div>

        <div className="w-full">
          <div className="flex items-baseline gap-6">
            <Heading>FAQ</Heading>
            <div className="h-[1px] w-full bg-black" />
          </div>

          <div>
            {FAQ.map(({ title, content }) => (
              <div className="not-first-of-type:mt-4 first-of-type:mt-10">
                <Collapse title={title} content={content} />
              </div>
            ))}
          </div>
        </div>
      </HomeLayout>
    </PageLayout>
  );
}
