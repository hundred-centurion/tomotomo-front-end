import * as React from 'react';
import { Dialog, DialogContent } from '@/shadcn/dialog.tsx';
import type { DialogProps } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils.ts';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { TUTORIAL_DATA } from '@/lib/tutorial.ts';
import { useUIStore } from '@/store';

const WIDTH = 1052;
const HEIGHT = 695;

type TutorialDialogContentProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  index: number;
  src: string;
};

const TutorialDialogContent = ({ className, index, src, ...props }: TutorialDialogContentProps) => {
  return (
    <div
      key={index}
      id={`tutorial-dialog-list-item-${index}`}
      className={cn('bg-cover bg-center bg-no-repeat', className)}
      style={{
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        backgroundImage: `url(${src})`,
      }}
      {...props}
    />
  );
};

export type TutorialDialogProps = Omit<React.ComponentProps<'div'>, 'children'> & Omit<DialogProps, 'children'> & {};

export default function TutorialDialog({ className, ...props }: TutorialDialogProps) {
  const { tutorialDialogVisible, hideTutorialDialog } = useUIStore();
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const totalSlides = TUTORIAL_DATA.length;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleClose = () => {
    hideTutorialDialog();
  };

  const isLastSlide = currentIndex === totalSlides - 1;

  return (
    <Dialog open={tutorialDialogVisible} {...props}>
      <DialogContent
        className={cn('border-0 p-0', className)}
        style={{
          width: `${WIDTH}px`,
          minWidth: `${WIDTH}px`,
          maxWidth: `${WIDTH}px`,
          height: `${HEIGHT}px`,
        }}
        showCloseButton={false}
      >
        <div className="relative flex items-center">
          {/* 이전 버튼 - 슬라이드 외부 왼쪽 */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-gray-100"
              style={{ left: '-60px', top: '50%' }}
              aria-label="이전 슬라이드"
            >
              <ChevronLeft size={24} className="text-destructive" />
            </button>
          )}

          <div
            id="tutorial-dialog-container"
            className="relative overflow-hidden"
            style={{
              width: `${WIDTH}px`,
              height: `${HEIGHT}px`,
            }}
          >
            {/* X 닫기 버튼 - 마지막 슬라이드에서만 표시 */}
            {isLastSlide && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 rounded-full bg-white/80 p-2 shadow-lg transition-all hover:bg-white"
                aria-label="닫기"
              >
                <X size={24} />
              </button>
            )}

            <div
              id="tutorial-dialog-list"
              className="flex"
              style={{
                width: `${WIDTH * totalSlides}px`,
                transform: `translateX(-${currentIndex * WIDTH}px)`,
                transition: 'transform 0.5s ease-in-out',
              }}
            >
              {TUTORIAL_DATA.map((value, index) => (
                <TutorialDialogContent key={`slide-${index}`} index={index} {...value} />
              ))}
            </div>

            {/* 인디케이터 */}
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {TUTORIAL_DATA.map((_, index) => (
                <button
                  key={`indicator-${index}`}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'h-2 w-2 rounded-full transition-all',
                    currentIndex === index ? 'w-6 bg-white' : 'bg-white/50',
                  )}
                  aria-label={`슬라이드 ${index + 1}로 이동`}
                />
              ))}
            </div>
          </div>

          {/* 다음 버튼 - 슬라이드 외부 오른쪽 */}
          {currentIndex < totalSlides - 1 && (
            <button
              onClick={handleNext}
              className="absolute z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-gray-100"
              style={{ right: '-60px', top: '50%' }}
              aria-label="다음 슬라이드"
            >
              <ChevronRight size={24} className="text-destructive" />
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
