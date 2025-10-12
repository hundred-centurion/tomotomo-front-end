import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import Gnb from '@/components/gnb.tsx';
import ProfileMenu from '@/components/profile-menu.tsx';
import { Heading } from '@/components/typography.tsx';
import { Link } from '@tanstack/react-router';
import { useTimerStore } from '@/store';

const headerVariants = cva(
  'w-full h-header flex justify-center items-center px-10 border-b transition-transform duration-700 ease-in-out fixed top-0 left-0 right-0 z-50 bg-background',
);

type HeaderProps = Omit<React.ComponentProps<'div'>, 'children'> & VariantProps<typeof headerVariants> & {};

export default function Header({ className, ...props }: HeaderProps) {
  const { isHeaderVisible, isHeaderHovered, setHeaderHovered } = useTimerStore();

  const handleMouseEnter = () => {
    setHeaderHovered(true);
  };

  const handleMouseLeave = () => {
    setHeaderHovered(false);
  };

  return (
    <header
      className={cn(
        headerVariants(),
        className,
        !isHeaderVisible && !isHeaderHovered ? '-translate-y-full' : 'translate-y-0',
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div className="flex w-full max-w-[1190px] items-center justify-between">
        <div className="w-1/5">
          <Link to="/">
            <Heading as="h2" className="inline-block">
              Tomotomo
            </Heading>
          </Link>
        </div>

        <div className="flex w-4/5 items-center justify-between">
          <Gnb />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
