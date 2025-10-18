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

export const swap = (arr: number[], i: number, j: number): void => {
  [arr[i], arr[j]] = [arr[j], arr[i]];
};

export const partition = (arr: number[], low: number, high: number): number => {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      swap(arr, i, j);
    }
  }

  swap(arr, i + 1, high);
  return i + 1;
};

export const sortRecursive = (arr: number[], low: number, high: number): void => {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    sortRecursive(arr, low, pivotIndex - 1);
    sortRecursive(arr, pivotIndex + 1, high);
  }
};

export const quickSort = (originalArr: number[]): number[] => {
  const arr = [...originalArr];
  sortRecursive(arr, 0, arr.length - 1);
  return arr;
};
