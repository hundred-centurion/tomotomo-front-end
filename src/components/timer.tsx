import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/shadcn/button.tsx';
import { cn, formatTime, range } from '@/lib/utils.ts';
import { Heading, Text } from '@/components/typography.tsx';
import { BotMessageSquare, Music, Smile } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/select.tsx';
import { Link } from '@tanstack/react-router';
import TimerSettingDialog from '@/components/timer-setting-dialog.tsx';
import { useCompleteTimer, useStartTimer, useTasks } from '@/hooks';
import EmptyWrapper from '@/components/empty-wrapper.tsx';
import LoadingWrapper from '@/components/loading-wrapper.tsx';
import { useAuthStore } from '@/store';
import { Avatar } from '@/shadcn/avatar.tsx';

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
const WORK_DURATION_INITIAL_VALUE = [1, 25, 30, 45, 60];
const BREAK_DURATION_INITIAL_VALUE = [1, 5, 10, 15, 20, 25, 30];

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

  const [selectedTaskID, setSelectedTaskID] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false); // 타이머가 시작되었는지 추적
  const [isResuming, setIsResuming] = useState(false); // 재개 중인지 추적
  const [isCompleted, setIsCompleted] = useState(false); // 모든 사이클 완료 상태 추적

  const user = useAuthStore((state) => state.user);
  const { data: tasks, isLoading: isTasksLoading } = useTasks();
  const [timerId, setTimerId] = useState<number | null>(null);
  const startTimer = useStartTimer();
  const completeTimer = useCompleteTimer();

  const handleStartPause = () => {
    if (!isActive && !hasStarted) {
      // 처음 시작하는 경우
      setHasStarted(true);
      setIsResuming(false);
    } else if (!isActive && hasStarted) {
      // 재개하는 경우
      setIsResuming(true);
    }
    setIsActive(!isActive);
  };

  const handleSave = (values: [number, number, number]) => {
    const [repeatCount, workCount, breakCount] = values;
    setRepeatDuration(repeatCount);
    setWorkDuration(workCount * 60);
    setBreakDuration(breakCount * 60);
    // 타이머 설정 변경 시 상태 초기화
    setHasStarted(false);
    setIsResuming(false);
    setIsActive(false);
    setCurrentCycle(1);
    setMode('work');
    setIsCompleted(false); // 완료 상태도 초기화
    setTimerId(null); // timerId도 초기화
  };

  const timerButton = useMemo(() => {
    // 모든 사이클 완료된 경우
    if (isCompleted) {
      return (
        <Button className="w-18 bg-yellow-400 text-black hover:bg-yellow-500 font-bold" disabled>
          완료
        </Button>
      );
    }

    if (mode === 'break') {
      return (
        <Button className={cn('w-18', 'bg-[#4285F4]')} onClick={handleStartPause}>
          {isActive ? '휴식 재개' : '휴식'}
        </Button>
      );
    }

    return (
      <Button
        className={cn('w-18', isActive ? 'bg-muted-foreground' : 'bg-destructive')}
        onClick={handleStartPause}
        disabled={!selectedTaskID}
      >
        {isActive ? '정지' : '집중'}
      </Button>
    );
  }, [mode, isActive, handleStartPause, selectedTaskID, isCompleted]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0 && (mode === 'work' ? selectedTaskID : true)) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);

      // 처음 시작할 때만 startTimer.mutate() 호출 (work 모드에서만)
      if (hasStarted && !isResuming && mode === 'work' && selectedTaskID) {
        console.log('타이머 시작 - startTimer.mutate() 호출');
        startTimer.mutate(
          {
            taskId: parseInt(selectedTaskID, 10),
            focusTime: workDuration / 60,
            breakTime: breakDuration / 60,
            repeatCount: repeatDuration,
          },
          {
            onSuccess: (data) => {
              // 응답에서 timerId를 받아서 설정
              if (data.id) {
                setTimerId(data.id);
                console.log('타이머 ID 설정:', data.id);
              }
            },
            onError: (error) => {
              console.error('타이머 시작 실패:', error);
            },
          },
        );
        setIsResuming(true); // 다음에는 재개로 처리
      } else if (mode === 'break' && hasStarted && !isResuming) {
        // break 모드에서 처음 시작할 때도 재개 상태로 설정
        setIsResuming(true);
      }
    } else if (timeRemaining === 0 && isActive) {
      setIsActive(false);

      if (mode === 'work') {
        setMode('break');
        setTimeRemaining(breakDuration);
        setSelectedTaskID(null);
      } else {
        if (onCycleComplete) {
          onCycleComplete(currentCycle);
        }

        if (currentCycle < repeatDuration && selectedTaskID) {
          setCurrentCycle((prev) => prev + 1);
          setRepeatDuration((prev) => prev - 1);
          setMode('work');
          setTimeRemaining(workDuration);
          // 다음 사이클은 재개로 처리
          setIsResuming(true);
        } else {
          // 모든 사이클 완료
          setIsActive(false);
          setHasStarted(false);
          setIsResuming(false);
          setIsCompleted(true); // 완료 상태 설정

          if (timerId) {
            console.log('모든 사이클 완료 - completeTimer.mutate() 호출');
            completeTimer.mutate({
              timerId,
              data: {
                actualFocusTime: {
                  seconds: 10,
                },
                actualBreakTime: {
                  seconds: 10,
                },
              },
            });
            setTimerId(null); // 완료 후 timerId 초기화
          }

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
    hasStarted,
    isResuming,
    selectedTaskID,
    timerId,
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
          <Select onValueChange={setSelectedTaskID} disabled={isActive}>
            <SelectTrigger className="w-[340px]">
              <SelectValue placeholder="작업을 선택하세요." />
            </SelectTrigger>
            <SelectContent>
              <EmptyWrapper value={user}>
                <LoadingWrapper loading={isTasksLoading}>
                  {!tasks || !tasks?.length ? (
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
                  ) : (
                    tasks.map(({ id, taskListColor, title }) => (
                      <SelectItem value={String(id!)}>
                        <Avatar className="h-3 w-3" style={{ backgroundColor: taskListColor }} />
                        {title}
                      </SelectItem>
                    ))
                  )}
                </LoadingWrapper>
              </EmptyWrapper>
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
