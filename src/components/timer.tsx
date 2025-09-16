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
import { useStartTimer, useWorkTimerComplete, useBreakTimerComplete, useTasks } from '@/hooks';
import EmptyWrapper from '@/components/empty-wrapper.tsx';
import LoadingWrapper from '@/components/loading-wrapper.tsx';
import { useAuthStore } from '@/store';
import { Avatar } from '@/shadcn/avatar.tsx';
import Chatbot from '@/components/chatbot.tsx';

const timerVariants = cva('');

type TimerProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof timerVariants> & {
    workMinutesOptions?: number[]; // 집중 시간 옵션 (분)
    breakMinutesOptions?: number[]; // 휴식 시간 옵션 (분)
    onCycleComplete?: (cycle: number) => void; // 한 사이클(집중+휴식) 완료 시 콜백
    onTimerEnd?: () => void; // 모든 사이클 완료 시 콜백
    externalTaskId?: number | null; // 외부에서 설정할 task ID
    autoStart?: boolean; // 자동 시작 여부
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
  externalTaskId,
  autoStart = false,
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
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // 챗봇 모달 상태

  const user = useAuthStore((state) => state.user);
  const { data: tasks, isLoading: isTasksLoading } = useTasks();
  const [timerId, setTimerId] = useState<number | null>(null);
  const startTimer = useStartTimer();
  const workTimerComplete = useWorkTimerComplete();
  const breakTimerComplete = useBreakTimerComplete();

  const handleStartPause = () => {
    if (!isActive && !hasStarted) {
      // 처음 시작하는 경우
      setHasStarted(true);
      setIsResuming(false);
    } else if (!isActive && hasStarted) {
      // 재개하는 경우
      setIsResuming(true);
    } else if (isActive) {
      // 정지하는 경우 - 현재 모드에 따라 적절한 완료 API 호출
      if (mode === 'work' && timerId) {
        console.log('집중 타이머 정지 - 집중 타이머 완료 API 호출');
        workTimerComplete.mutate({
          timerId,
          data: {
            actualFocusTime: {
              seconds: workDuration - timeRemaining,
            },
            actualBreakTime: {
              seconds: 0,
            },
          },
        });
      } else if (mode === 'break' && timerId) {
        console.log('휴식 타이머 정지 - 휴식 타이머 완료 API 호출');
        breakTimerComplete.mutate({
          timerId,
          data: {
            actualFocusTime: {
              seconds: 0,
            },
            actualBreakTime: {
              seconds: breakDuration - timeRemaining,
            },
          },
        });
      }
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
        <Button className="w-18 bg-yellow-400 font-bold text-black hover:bg-yellow-500" disabled>
          완료
        </Button>
      );
    }

    if (mode === 'break') {
      return (
        <Button className={cn('w-18', 'bg-[#4285F4]')} onClick={handleStartPause}>
          {isActive ? '휴식 정지' : '휴식'}
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

      // 처음 시작할 때만 startTimer.mutate() 호출
      if (hasStarted && !isResuming) {
        if (mode === 'work' && selectedTaskID) {
          console.log('집중 타이머 시작 - startTimer.mutate() 호출');
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
                console.error('집중 타이머 시작 실패:', error);
              },
            },
          );
        } else if (mode === 'break') {
          console.log('휴식 타이머 시작 - startTimer.mutate() 호출');
          startTimer.mutate(
            {
              taskId: parseInt(selectedTaskID || '0', 10),
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
                console.error('휴식 타이머 시작 실패:', error);
              },
            },
          );
        }
        setIsResuming(true); // 다음에는 재개로 처리
      }
    } else if (timeRemaining === 0 && isActive) {
      setIsActive(false);

      if (mode === 'work') {
        // 집중 타이머가 끝났을 때 - 집중 타이머 완료 API 호출
        if (timerId) {
          console.log('집중 타이머 완료 - 집중 타이머 완료 API 호출');
          workTimerComplete.mutate({
            timerId,
            data: {
              actualFocusTime: {
                seconds: workDuration,
              },
              actualBreakTime: {
                seconds: 0,
              },
            },
          });
        }
        setMode('break');
        setTimeRemaining(breakDuration);
        setSelectedTaskID(null);
      } else {
        // 휴식 타이머가 끝났을 때 - 휴식 타이머 완료 API 호출
        if (timerId) {
          console.log('휴식 타이머 완료 - 휴식 타이머 완료 API 호출');
          breakTimerComplete.mutate({
            timerId,
            data: {
              actualFocusTime: {
                seconds: 0,
              },
              actualBreakTime: {
                seconds: breakDuration,
              },
            },
          });
        }

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
          setTimerId(null); // 완료 후 timerId 초기화

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
    startTimer,
    workTimerComplete,
    breakTimerComplete,
  ]);

  useEffect(() => {
    if (!isActive) {
      setTimeRemaining(workDuration);
    }
  }, [workDuration]); // isActive 상태 추가하지마세요. 자세한 내용은 최강재에게 문의.

  // 외부에서 task ID가 변경될 때 타이머에 반영
  useEffect(() => {
    if (externalTaskId) {
      setSelectedTaskID(String(externalTaskId));
    }
  }, [externalTaskId]);

  // autoStart가 true일 때 자동으로 타이머 시작
  useEffect(() => {
    if (autoStart && externalTaskId && !isActive && !hasStarted) {
      setSelectedTaskID(String(externalTaskId));
      setIsActive(true);
      setHasStarted(true);
      setIsResuming(false);
    }
  }, [autoStart, externalTaskId, isActive, hasStarted]);

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
          <Button variant="ghost" onClick={() => setIsChatbotOpen(true)}>
            <BotMessageSquare />
          </Button>
        </div>

        <div className="flex items-center justify-center">
          <Select value={selectedTaskID || undefined} onValueChange={setSelectedTaskID} disabled={isActive}>
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
                      <SelectItem key={id} value={String(id!)}>
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

      {/* 챗봇 모달 */}
      <Chatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onTaskSelectAndStart={(taskId) => {
          setSelectedTaskID(String(taskId));
          setIsActive(true);
          setHasStarted(true);
          setIsResuming(false);
          setIsChatbotOpen(false);
        }}
      />
    </div>
  );
}
