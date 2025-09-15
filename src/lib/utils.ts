import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const range = (number: number) => {
  return Array.from(Array(number).keys());
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')} : ${String(remainingSeconds).padStart(2, '0')}`;
};

/**
 * 태스크를 dueDate 기준으로 급한 순서대로 정렬합니다.
 * dueDate가 없는 태스크는 맨 뒤로 배치됩니다.
 */
export const sortTasksByDueDate = <T extends { dueDate?: string }>(tasks: T[]): T[] => {
  return [...tasks].sort((a, b) => {
    // dueDate가 없는 경우 맨 뒤로
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    // dueDate가 빠른 순서대로 정렬
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
};
