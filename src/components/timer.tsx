import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Button } from '@/shadcn/button.tsx';
import { cn, formatTime, range } from '@/lib/utils.ts';
import { Heading, Text } from '@/components/typography.tsx';
import { BotMessageSquare, Smile, Music } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/select.tsx';
import { Link } from '@tanstack/react-router';
import TimerSettingDialog from '@/components/timer-setting-dialog.tsx';
import {
  useStartTimer,
  useStartBreakTimer,
  useStopBreakTimer,
  useStopFocusTimer,
  useTimerFocusRestart,
  useTasks,
} from '@/hooks';
import EmptyWrapper from '@/components/empty-wrapper.tsx';
import LoadingWrapper from '@/components/loading-wrapper.tsx';
import { useAuthStore, useTimerStore } from '@/store';
import { Avatar } from '@/shadcn/avatar.tsx';
import Chatbot from '@/components/chatbot.tsx';
import { toast } from 'sonner';
import { GAEvents } from '@/lib/ga';

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
const WORK_DURATION_INITIAL_VALUE = [25, 30, 45, 60];
const BREAK_DURATION_INITIAL_VALUE = [5, 10, 15, 20, 25, 30];

// Audio 파일 목록
const AUDIO_FILES = [
  '/audios/1_Ruby.mp3',
  '/audios/2_River.mp3',
  '/audios/3_Quartz.mp3',
  '/audios/4_Amethyst.mp3',
  '/audios/5_Amber.mp3',
  '/audios/6_저녁의-발라드.mp3',
  '/audios/7_그날-그때.mp3',
];

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
  // 타이머 설정 상태
  const [repeatDuration, setRepeatDuration] = useState(REPEAT_DURATION_INITIAL_VALUE);
  const [workDuration, setWorkDuration] = useState(workMinutesOptions[0] * 60);
  const [breakDuration, setBreakDuration] = useState(breakMinutesOptions[0] * 60);

  // 타이머 실행 상태
  const [timeRemaining, setTimeRemaining] = useState(workDuration);
  const [mode, setMode] = useState<TimerMode>('work');
  const [isActive, setIsActive] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [selectedTaskID, setSelectedTaskID] = useState<string | null>(null);
  const [timerId, setTimerId] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isCycleInProgress, setIsCycleInProgress] = useState(false); // 사이클 진행 중 여부

  // Audio 재생을 위한 ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const user = useAuthStore((state) => state.user);
  const isAuth = useAuthStore((state) => state.isAuthenticated);
  const { setHeaderVisible } = useTimerStore();

  // 랜덤 오디오 선택 및 재생 함수
  const playRandomAudio = useCallback(() => {
    if (!audioRef.current) return;

    const randomIndex = Math.floor(Math.random() * AUDIO_FILES.length);
    const audioFile = AUDIO_FILES[randomIndex];

    audioRef.current.src = audioFile;
    audioRef.current.play().catch((error) => {
      console.error('Audio playback failed:', error);
    });
  }, []);

  const { data: tasks, isLoading: isTasksLoading } = useTasks();
  const startTimer = useStartTimer();
  const startBreakTimer = useStartBreakTimer();
  const stopBreakTimer = useStopBreakTimer();
  const stopFocusTimer = useStopFocusTimer();
  const timerFocusRestart = useTimerFocusRestart();

  // 타이머 시작/정지 핸들러
  const handleStartPause = useCallback(() => {
    if (isCompleted) return;

    if (!isActive) {
      // 타이머 시작
      if (isAuth) {
        // 로그인 상태 - 기존 로직 (API 호출)
        if (mode === 'work' && selectedTaskID && !timerId) {
          // 처음 work 시작 - /api/timer/start 호출
          GAEvents.startTodoTimer(); // 특정 할 일에 타이머 시작 이벤트
          startTimer.mutate(
            {
              taskId: parseInt(selectedTaskID, 10),
              focusTime: workDuration / 60,
              breakTime: breakDuration / 60,
              repeatCount: repeatDuration,
            },
            {
              onSuccess: (data) => {
                if (data.id) {
                  setTimerId(data.id);
                }
                setIsActive(true);
                setIsCycleInProgress(true); // 사이클 시작
                setHeaderVisible(false);
              },
            },
          );
        } else if (mode === 'work' && timerId) {
          // work 재시작 - /api/timer/{timerId}/focus/start 호출
          timerFocusRestart.mutate(timerId, {
            onSuccess: () => {
              setIsActive(true);
              setHeaderVisible(false);
            },
          });
        } else if (mode === 'break' && timerId) {
          // break 시작 - /api/timer/{timerId}/break/start 호출
          startBreakTimer.mutate(timerId, {
            onSuccess: () => {
              setIsActive(true);
              setHeaderVisible(false);
            },
          });
        }
      } else {
        // 비로그인 상태 - 로컬에서만 동작 (API 호출 없음)
        setIsActive(true);
        setIsCycleInProgress(true);
        setHeaderVisible(false);
      }
    } else {
      // 타이머 정지
      if (isAuth) {
        // 로그인 상태 - API 호출
        if (mode === 'work' && timerId) {
          // work 정지 - /api/timer/{timerId}/focus/stop 호출
          stopFocusTimer.mutate(timerId);
        } else if (mode === 'break' && timerId) {
          // break 정지 - /api/timer/{timerId}/break/stop 호출
          stopBreakTimer.mutate(timerId);
        }
      }
      // 비로그인 상태는 로컬 상태만 업데이트
      setIsActive(false);
      setHeaderVisible(true);
    }
  }, [
    isCompleted,
    isActive,
    isAuth,
    mode,
    selectedTaskID,
    timerId,
    startTimer,
    timerFocusRestart,
    startBreakTimer,
    stopFocusTimer,
    stopBreakTimer,
    setHeaderVisible,
    breakDuration,
    repeatDuration,
    workDuration,
  ]);

  // 타이머 설정 저장 핸들러
  const handleSave = (values: [number, number, number]) => {
    const [repeatCount, workCount, breakCount] = values;
    setRepeatDuration(repeatCount);
    setWorkDuration(workCount * 60);
    setBreakDuration(breakCount * 60);

    // GA 이벤트 전송
    GAEvents.changeSettings('pomodoro_duration');

    // 타이머 상태 초기화
    setIsActive(false);
    setCurrentCycle(1);
    setMode('work');
    setTimeRemaining(workCount * 60);
    setIsCompleted(false);
    setTimerId(null);
    setIsCycleInProgress(false); // 사이클 진행 상태 초기화
  };

  // 완료 버튼 핸들러
  const handleComplete = useCallback(() => {
    // 선택된 task의 제목 찾기
    const selectedTask = tasks?.find((task) => task.id === parseInt(selectedTaskID || '0', 10));
    const taskTitle = selectedTask?.title || '작업';

    // Toast 메시지 표시
    toast.success(`${taskTitle}을(를) 완료했습니다!`);

    // GA 이벤트 전송
    GAEvents.resetTimer('pomodoro');

    // 모든 상태를 초기값으로 리셋
    setIsActive(false);
    setCurrentCycle(1);
    setMode('work');
    setTimeRemaining(WORK_DURATION_INITIAL_VALUE[0] * 60);
    setWorkDuration(WORK_DURATION_INITIAL_VALUE[0] * 60);
    setBreakDuration(BREAK_DURATION_INITIAL_VALUE[0] * 60);
    setRepeatDuration(REPEAT_DURATION_INITIAL_VALUE);
    setIsCompleted(false);
    setSelectedTaskID(null);
    setTimerId(null);
    setIsCycleInProgress(false); // 사이클 진행 상태 초기화
    setHeaderVisible(true);

    // 콜백 호출
    if (onTimerEnd) {
      onTimerEnd();
    }
  }, [tasks, selectedTaskID, setHeaderVisible, onTimerEnd]);

  // 타이머 버튼 렌더링
  const timerButton = useMemo(() => {
    if (isCompleted) {
      return (
        <Button className="w-18 bg-yellow-400 font-bold text-black hover:bg-yellow-500" onClick={handleComplete}>
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
        disabled={isAuth && !selectedTaskID} // 로그인 상태에서만 task 선택 필수
      >
        {isActive ? '정지' : '집중'}
      </Button>
    );
  }, [mode, isActive, isAuth, selectedTaskID, isCompleted, handleStartPause, handleComplete]);

  // 타이머 카운트다운
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeRemaining]);

  // 타이머 완료 처리
  useEffect(() => {
    if (timeRemaining === 0 && isActive) {
      setIsActive(false);

      if (mode === 'work') {
        // Work 타이머 완료
        if (isAuth && timerId) {
          // 로그인 상태 - Focus Stop API 호출
          stopFocusTimer.mutate(timerId);
        }
        // Break 모드로 전환
        setMode('break');
        setTimeRemaining(breakDuration);
      } else {
        // Break 타이머 완료
        if (isAuth && timerId) {
          // 로그인 상태 - Break Stop API 호출
          stopBreakTimer.mutate(timerId);
        }

        // 사이클 완료 콜백
        if (onCycleComplete) {
          onCycleComplete(currentCycle);
        }

        // 다음 사이클 또는 완료 처리
        if (currentCycle < repeatDuration) {
          setCurrentCycle((prev) => prev + 1);
          setRepeatDuration((prev) => prev - 1); // 남은 사이클 수 감소
          setMode('work');
          setTimeRemaining(workDuration);
          // 다음 사이클이 있으므로 사이클 진행 상태 유지 (task 변경 불가)
        } else {
          // 모든 사이클 완료 - 완료 버튼 표시
          GAEvents.resetTimer('pomodoro'); // 타이머 완료 시 reset 이벤트
          setIsCompleted(true);
          setIsCycleInProgress(false); // 모든 사이클 완료, task 변경 가능
          if (onTimerEnd) {
            onTimerEnd();
          }
        }
      }
    }
  }, [
    timeRemaining,
    isActive,
    isAuth,
    mode,
    timerId,
    breakDuration,
    currentCycle,
    repeatDuration,
    workDuration,
    onCycleComplete,
    onTimerEnd,
    stopFocusTimer,
    stopBreakTimer,
  ]);

  // workDuration 변경 시 timeRemaining 업데이트 (타이머가 시작되지 않은 상태에서만)
  useEffect(() => {
    if (!isActive && mode === 'work' && !timerId && !isCycleInProgress) {
      setTimeRemaining(workDuration);
    }
  }, [workDuration, isActive, mode, timerId, isCycleInProgress]);

  // 외부에서 task ID가 변경될 때 타이머에 반영
  useEffect(() => {
    if (externalTaskId) {
      setSelectedTaskID(String(externalTaskId));
    }
  }, [externalTaskId]);

  // autoStart가 true일 때 자동으로 타이머 시작
  useEffect(() => {
    if (autoStart && externalTaskId && !isActive) {
      setSelectedTaskID(String(externalTaskId));
      setIsActive(true);
    }
  }, [autoStart, externalTaskId, isActive]);

  // Audio element 초기화
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = false;

      // 음악이 끝나면 다음 랜덤 음악 재생
      audioRef.current.addEventListener('ended', () => {
        if (!audioRef.current) return;
        const randomIndex = Math.floor(Math.random() * AUDIO_FILES.length);
        const audioFile = AUDIO_FILES[randomIndex];
        audioRef.current.src = audioFile;
        audioRef.current.play().catch((error) => {
          console.error('Audio playback failed:', error);
        });
      });
    }
  }, []);

  // Audio 재생 제어
  useEffect(() => {
    if (!audioRef.current) return;

    // isMusicOn이 true이고 타이머가 활성화되면 음악 재생
    if (isMusicOn && isActive) {
      if (audioRef.current.paused) {
        // src가 없거나 비어있으면 새로운 음악 재생, 있으면 이어서 재생
        if (!audioRef.current.src || audioRef.current.src === '') {
          playRandomAudio();
        } else {
          audioRef.current.play().catch((error) => {
            console.error('Audio resume failed:', error);
          });
        }
      }
    } else {
      // 타이머가 비활성화되거나 isMusicOn이 false이면 음악 정지
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isMusicOn, isActive, playRandomAudio]);

  // if (!isAuth) {
  //   toast.error('로그인이 필요합니다!');
  //   return <Navigate to={LOG_IN_PAGE} />;
  // }

  return (
    <div className={cn(timerVariants(), className)} {...props}>
      <div className="flex w-full items-center justify-center gap-1">
        {range(repeatDuration).map((_, index) => (
          <Smile key={index} width={24} height={24} />
        ))}
      </div>

      <div className="flex w-full justify-center">
        <Heading className="min-w-[400px] text-center text-[160px] tabular-nums">{formatTime(timeRemaining)}</Heading>
      </div>

      <div className="mb-8 flex w-full items-center justify-between">
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() => setIsChatbotOpen(true)}
            disabled={!isAuth || isActive || isCycleInProgress}
          >
            <BotMessageSquare />
          </Button>
        </div>

        <div className="flex items-center justify-center">
          <Select
            value={selectedTaskID || undefined}
            onValueChange={(value) => {
              if (isCycleInProgress) {
                toast.error('사이클이 진행 중일 때는 작업을 변경할 수 없습니다.');
                return;
              }
              setSelectedTaskID(value);
            }}
            disabled={!isAuth || isActive || isCycleInProgress}
          >
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
                    tasks
                      .filter((task) => !task.completed)
                      .map(({ id, taskListColor, title }) => (
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
          <TimerSettingDialog
            onSave={handleSave}
            disabled={isActive}
            repeatCountValue={repeatDuration}
            workMinutesValue={Math.round(workDuration / 60)}
            breakMinutesValue={Math.round(breakDuration / 60)}
          />

          <div className="relative">
            <Button variant="ghost" onClick={() => setIsMusicOn(!isMusicOn)} disabled={isActive}>
              <Music className={isMusicOn ? 'text-primary' : ''} />
            </Button>
            <div
              className={cn(
                'absolute -right-1 -bottom-1 flex h-3 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white',
                isMusicOn ? 'bg-green-500' : 'bg-red-500',
              )}
            >
              {isMusicOn ? 'ON' : 'OFF'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">{timerButton}</div>

      {/* 챗봇 모달 - 로그인 상태에서만 */}
      {isAuth && (
        <Chatbot
          isOpen={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)}
          onTaskSelect={(taskId) => {
            // 사이클 진행 중이면 task 변경 불가
            if (isCycleInProgress) {
              toast.error('사이클이 진행 중일 때는 작업을 변경할 수 없습니다.');
              return;
            }
            // Task 선택 시 초기화
            setSelectedTaskID(String(taskId));
          }}
          onTaskSelectAndStart={(taskId) => {
            // 기존 설정 유지하면서 타이머 시작
            setSelectedTaskID(String(taskId));
            setIsChatbotOpen(false);

            // 직접 API 호출
            startTimer.mutate(
              {
                taskId: taskId,
                focusTime: workDuration / 60,
                breakTime: breakDuration / 60,
                repeatCount: repeatDuration,
              },
              {
                onSuccess: (data) => {
                  if (data.id) {
                    setTimerId(data.id);
                  }
                  setIsActive(true);
                  setIsCycleInProgress(true); // 사이클 시작
                  setHeaderVisible(false);
                },
              },
            );
          }}
        />
      )}
    </div>
  );
}
