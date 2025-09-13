import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/shadcn/button.tsx';
import { cn, formatTime, range } from '@/lib/utils.ts';
import { Heading, Text } from '@/components/typography.tsx';
import { BotMessageSquare, Music, Smile } from 'lucide-react';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shadcn/select.tsx';
import { Link } from '@tanstack/react-router';
import TimerSettingDialog from '@/components/timer-setting-dialog.tsx';

const timerVariants = cva('');

type TimerProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof timerVariants> & {
    workMinutesOptions?: number[]; // 집중 시간 옵션 (분)
    breakMinutesOptions?: number[]; // 휴식 시간 옵션 (분)
    onCycleComplete?: (cycle: number) => void; // 한 사이클(집중+휴식) 완료 시 콜백
    onTimerEnd?: () => void; // 모든 사이클 완료 시 콜백
  };

type TimerMode = 'work' | 'break';

const REPEAT_DURATION_INITIAL_VALUE = 2;
const WORK_DURATION_INITIAL_VALUE = [25, 30, 45, 60];
const BREAK_DURATION_INITIAL_VALUE = [5, 10, 15, 20, 25, 30];

export default function Timer({
  className,
  workMinutesOptions = WORK_DURATION_INITIAL_VALUE,
  breakMinutesOptions = BREAK_DURATION_INITIAL_VALUE,
  onCycleComplete,
  onTimerEnd,
  ...props
}: TimerProps) {
  const [repeatDuration, setRepeatDuration] = useState(REPEAT_DURATION_INITIAL_VALUE);
  const [workDuration, setWorkDuration] = useState(workMinutesOptions[0] * 60);
  const [breakDuration, setBreakDuration] = useState(breakMinutesOptions[0] * 60);
  const [timeRemaining, setTimeRemaining] = useState(workDuration);
  const [mode, setMode] = useState<TimerMode>('work');
  const [isActive, setIsActive] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(1);

  const handleStartPause = () => setIsActive(!isActive);

  // const handleReset = useCallback(() => {
  //   setIsActive(false);
  //   setMode('work');
  //   setCurrentCycle(1);
  //   setTimeRemaining(workDuration);
  // }, [workDuration]);

  const handleSave = (values: [number, number, number]) => {
    const [repeatCount, workCount, breakCount] = values;
    setRepeatDuration(repeatCount);
    setWorkDuration(workCount * 60);
    setBreakDuration(breakCount * 60);
  };

  const timerButton = useMemo(() => {
    if (mode === 'break') {
      return (
        <Button className={cn('w-18', 'bg-[#4285F4]')} onClick={handleStartPause}>
          {isActive ? '재개' : '휴식'}
        </Button>
      );
    }

    return (
      <Button className={cn('w-18', isActive ? 'bg-muted-foreground' : 'bg-destructive')} onClick={handleStartPause}>
        {isActive ? '정지' : '집중'}
      </Button>
    );
  }, [mode, isActive, handleStartPause]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      setIsActive(false);

      if (mode === 'work') {
        setMode('break');
        setTimeRemaining(breakDuration);
      } else {
        if (onCycleComplete) {
          onCycleComplete(currentCycle);
        }

        if (currentCycle < repeatDuration) {
          setCurrentCycle((prev) => prev + 1);
          setRepeatDuration((prev) => prev - 1);
          setMode('work');
          setTimeRemaining(workDuration);
        } else {
          setIsActive(false);

          if (onTimerEnd) {
            onTimerEnd();
          }
        }
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [
    isActive,
    timeRemaining,
    mode,
    workDuration,
    breakDuration,
    currentCycle,
    repeatDuration,
    onCycleComplete,
    onTimerEnd,
  ]);

  useEffect(() => {
    if (!isActive) {
      setTimeRemaining(workDuration);
    }
  }, [workDuration]); // isActive 상태 추가하지마세요. 자세한 내용은 최강재에게 문의.

  return (
    <div className={cn(timerVariants(), className)} {...props}>
      <div className="flex w-full items-center justify-center gap-1">
        {range(repeatDuration).map((_, index) => (
          <Smile key={index} width={24} height={24} />
        ))}
      </div>

      <Heading className="text-[160px]">{formatTime(timeRemaining)}</Heading>

      <div className="mb-8 flex w-full items-center justify-between">
        <div className="flex items-center justify-center">
          <Button variant="ghost">
            <BotMessageSquare />
          </Button>
        </div>

        <div className="flex items-center justify-center">
          <Select>
            <SelectTrigger className="w-[340px]">
              <SelectValue placeholder="작업을 선택하세요." />
            </SelectTrigger>
            <SelectContent>
              <div className="flex h-full w-full flex-col items-center justify-center p-4">
                <img src="/images/task-empty.png" alt="Empty image" className="h-[48px] w-[48px]" />

                <div className="flex flex-col items-center">
                  <Text as="small" className="text-muted-foreground">
                    작업 설정이 되어있지 않아요.
                  </Text>
                  <Text as="small" className="text-muted-foreground underline">
                    <Link to="/tasks">[할 일 목록]으로 이동</Link>
                  </Text>
                </div>
              </div>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center">
          <TimerSettingDialog onSave={handleSave} />

          <Button variant="ghost">
            <Music />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center">{timerButton}</div>
    </div>
  );
}
