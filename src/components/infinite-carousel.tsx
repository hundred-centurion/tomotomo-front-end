import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const infiniteCarouselVariants = cva('w-[1250px] h-[350px]');

export type InfiniteCarouselProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof infiniteCarouselVariants> & {
    children: React.ReactNode[];
  };

export default function InfiniteCarousel({ children, className, ...props }: InfiniteCarouselProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // 아이템 개수에 따른 width 계산 (2개: 50%, 3개: 33.333%, 4개 이상: 25%)
  const getItemWidth = React.useCallback(
    (totalItems: number) => {
      if (totalItems === 2) return containerWidth * 0.5;
      if (totalItems === 3) return containerWidth * 0.33333;
      return containerWidth * 0.25; // 4개 이상일 때
    },
    [containerWidth],
  );

  // 컨테이너 너비 측정
  React.useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);

  // 무한 스크롤을 위한 아이템 복제
  const duplicatedChildren = React.useMemo(() => {
    if (children.length === 0) return [];
    return [...children, ...children, ...children]; // 앞뒤로 복제
  }, [children]);

  // 리스트 너비 계산 (itemWidth × children.length)
  const itemWidth = getItemWidth(children.length);
  const listWidth = itemWidth * children.length;

  // 스크롤 이벤트 핸들러
  const handleScroll = React.useCallback(() => {
    if (!listRef.current || isTransitioning || children.length === 0) return;

    const scrollLeft = listRef.current.scrollLeft;
    const itemWidth = getItemWidth(children.length);
    const totalItems = children.length;

    // 첫 번째 세트의 끝에 도달했을 때 (두 번째 세트의 시작으로 이동)
    if (scrollLeft >= itemWidth * totalItems) {
      setIsTransitioning(true);
      listRef.current.scrollLeft = itemWidth * totalItems;
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }
    // 마지막 세트의 시작에 도달했을 때 (첫 번째 세트의 끝으로 이동)
    else if (scrollLeft < itemWidth * totalItems) {
      setIsTransitioning(true);
      listRef.current.scrollLeft = itemWidth * totalItems;
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }
  }, [getItemWidth, children.length, isTransitioning]);

  // 초기 위치 설정 (두 번째 세트의 시작)
  React.useEffect(() => {
    if (listRef.current && containerWidth > 0 && children.length > 0) {
      const itemWidth = getItemWidth(children.length);
      const totalItems = children.length;
      listRef.current.scrollLeft = itemWidth * totalItems;
    }
  }, [getItemWidth, containerWidth, children.length]);

  if (children.length === 0) {
    return (
      <div className={cn(infiniteCarouselVariants(), className)} {...props}>
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-gray-500">표시할 아이템이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(infiniteCarouselVariants(), className)} {...props}>
      <div ref={containerRef} className="h-full w-full overflow-hidden">
        <div
          ref={listRef}
          className="flex h-full transition-transform duration-75 ease-out"
          style={{ width: `${listWidth * 3}px` }} // 3배로 복제했으므로 3배 너비
          onScroll={handleScroll}
        >
          {duplicatedChildren.map((child, index) => (
            <div key={index} className="h-full flex-shrink-0" style={{ width: `${itemWidth}px` }}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
