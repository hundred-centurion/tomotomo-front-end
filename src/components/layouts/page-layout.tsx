import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import Header from '@/components/layouts/header.tsx';
import Monitor from '@/components/monitor.tsx';
import TutorialDialog from '@/components/tutorial-dialog.tsx';
import { useAuthStore, useTimerStore } from '@/store';

const pageLayoutVariants = cva('');

type PageLayoutProps = React.ComponentProps<'div'> &
  VariantProps<typeof pageLayoutVariants> & {
    withHeader?: boolean;
    withFooter?: boolean;
  };

export default function PageLayout({
  children,
  className,
  withHeader = true,
  withFooter = false,
  ...props
}: PageLayoutProps) {
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const { isHeaderVisible, isHeaderHovered, setHeaderHovered } = useTimerStore();

  const handleTopAreaMouseEnter = () => {
    setHeaderHovered(true);
  };

  const handleTopAreaMouseLeave = () => {
    setHeaderHovered(false);
  };

  return (
    <>
      <Monitor />
      {isAuth && <TutorialDialog />}
      <div className={cn(pageLayoutVariants(), className)} {...props}>
        {withHeader && (
          <>
            {/* 헤더가 숨겨진 상태에서 마우스 호버를 위한 투명한 상단 영역 */}
            {!isHeaderVisible && !isHeaderHovered && (
              <div
                className="fixed top-0 right-0 left-0 z-40 h-8"
                onMouseEnter={handleTopAreaMouseEnter}
                onMouseLeave={handleTopAreaMouseLeave}
              />
            )}
            <Header />
            {/* 헤더 공간을 항상 유지하여 레이아웃 시프트 방지 */}
            <div className="h-header" />
          </>
        )}
        {children}
        {withFooter && <footer>asd</footer>}
      </div>
    </>
  );
}
