import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Dialog, DialogContent } from '@/shadcn/dialog.tsx';
import type { DialogProps } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils.ts';
import { Text } from '@/components/typography.tsx';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/shadcn/carousel.tsx';
import { Button } from '@/shadcn/button.tsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Checkbox } from '@/shadcn/checkbox.tsx';

const VISIBLE_DIALOG_KEY_NAME = 'tutorial-visible';

const tutorialDialogContentVariants = cva('w-full h-[400px] rounded-lg flex flex-col');

export type TutorialDialogContentProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof tutorialDialogContentVariants> & {
    current: number;
    count: number;
    onNextClick: () => void;
    onPrevClick: () => void;
    checked: boolean;
    onCheckedToggle: () => void;
  };

export function TutorialDialogContent({
  className,
  current,
  count,
  onNextClick,
  onPrevClick,
  checked,
  onCheckedToggle,
  ...props
}: TutorialDialogContentProps) {
  return (
    <div className={cn(tutorialDialogContentVariants(), className)} {...props}>
      <div className="bg-muted h-3/5 w-full rounded-lg" />
      <div className="h-2/5 w-full">
        <div className="flex h-full w-full flex-col items-center gap-2 p-4">
          <Text className="text-xl font-bold">튜토리얼 테스트 - {current}</Text>
          <Text className="text-[14px] font-thin">튜토리얼 설명입니다</Text>
          <div className="flex items-center gap-2">
            {current !== 0 && (
              <Button variant="outline" onClick={onPrevClick}>
                <ChevronLeft />
                이전
              </Button>
            )}
            {current < count - 1 && (
              <Button onClick={onNextClick}>
                다음
                <ChevronRight />
              </Button>
            )}
          </div>

          <div className="flex w-full items-center gap-1">
            <Checkbox id="visible-tutorial" checked={checked} />
            <label htmlFor="visible-tutorial" className="text-xs" onClick={onCheckedToggle}>
              다시 보지 않기
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

const tutorialDialogVariants = cva('rounded-lg');

export type TutorialDialogProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof tutorialDialogVariants> &
  Omit<DialogProps, 'children'> & {};

export default function TutorialDialog({ className, ...props }: TutorialDialogProps) {
  const [open, setOpen] = React.useState<boolean>(true);

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState<number>(0);
  const [count, setCount] = React.useState<number>(0);
  const [checked, setChecked] = React.useState<boolean>(false);

  const onNextClick = React.useCallback(() => {
    if (!api) {
      return;
    }

    if (!api.canScrollNext()) {
      return;
    }

    setCurrent(current + 1);
    api.scrollTo(current + 1);
  }, [api, current]);
  const onPrevClick = React.useCallback(() => {
    if (!api) {
      return;
    }

    if (!api.canScrollPrev()) {
      return;
    }

    setCurrent(current - 1);
    api.scrollTo(current - 1);
  }, [api, current]);

  const onDialogOpenChange = (open: boolean) => {
    if (checked) {
      window.localStorage.setItem(VISIBLE_DIALOG_KEY_NAME, '1');
    }
    setOpen(open);
  };

  React.useEffect(() => {
    if (!window) {
      return;
    }

    const visible = window.localStorage.getItem(VISIBLE_DIALOG_KEY_NAME);

    setOpen(!visible);
  }, []);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);

    api.on('select', (emblaApi) => {
      const selected = emblaApi.selectedScrollSnap();
      setCurrent(selected);
    });
  }, [api]);

  return (
    <Dialog open={open} onOpenChange={onDialogOpenChange} {...props}>
      <DialogContent className="border-none p-0">
        <Carousel
          className="w-[512px] max-w-[512px] min-w-[512px] p-2"
          setApi={setApi}
          onScroll={(event) => console.log(event)}
        >
          <CarouselContent className={cn(tutorialDialogVariants(), className)}>
            <CarouselItem>
              <TutorialDialogContent
                current={current}
                count={count}
                onNextClick={onNextClick}
                onPrevClick={onPrevClick}
                checked={checked}
                onCheckedToggle={() => setChecked((prevState) => !prevState)}
              />
            </CarouselItem>
            <CarouselItem>
              <TutorialDialogContent
                current={current}
                count={count}
                onNextClick={onNextClick}
                onPrevClick={onPrevClick}
                checked={checked}
                onCheckedToggle={() => setChecked((prevState) => !prevState)}
              />
            </CarouselItem>
            <CarouselItem>
              <TutorialDialogContent
                current={current}
                count={count}
                onNextClick={onNextClick}
                onPrevClick={onPrevClick}
                checked={checked}
                onCheckedToggle={() => setChecked((prevState) => !prevState)}
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
