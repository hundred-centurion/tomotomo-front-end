import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Button } from '@/components/ui/button.tsx';
import { SlidersHorizontal, Smile } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.tsx';
import Range from '@/components/range.tsx';
import { range } from '@/lib/utils.ts';

const timerVariants = cva('w-full flex justify-center items-center flex-col');

type TimerProps = Omit<React.ComponentProps<'div'>, 'children'> & VariantProps<typeof timerVariants>;

const Timer: React.FC<TimerProps> = ({ className, ...props }) => {
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  // const [initialTime, setInitialTime] = useState<number>(25 * 60);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  // const [inputMinutes, setInputMinutes] = useState<number>(25);

  const [repeat, setRepeat] = useState<number>(2);
  const [shortBreak, setShortBreak] = useState<number>(5);
  const [selectedTask, setSelectedTask] = useState<string>();

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimerInterval = () => {
    if (!timerIntervalRef?.current) {
      return;
    }

    clearInterval(timerIntervalRef.current);
  };

  useEffect(() => {
    if (!isRunning || totalSeconds <= 0) {
      clearTimerInterval();

      if (totalSeconds === 0 && isRunning) {
        setIsRunning(false);
        setRepeat(repeat - 1);
      }

      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTotalSeconds((prev: number) => {
        const newTotal = prev - 1;
        setMinutes(Math.floor(newTotal / 60));
        setSeconds(newTotal % 60);
        return newTotal;
      });
    }, 1000);

    return () => clearTimerInterval();
  }, [isRunning, totalSeconds]);

  const toggleTimer = (): void => {
    setIsRunning(!isRunning);
  };

  // const resetTimer = (): void => {
  //   setIsRunning(false);
  //   setTotalSeconds(initialTime);
  //   setMinutes(Math.floor(initialTime / 60));
  //   setSeconds(initialTime % 60);
  //   clearTimerInterval();
  // };
  //
  // const setTime = (): void => {
  //   const newTime: number = inputMinutes * 60;
  //   setInitialTime(newTime);
  //   setTotalSeconds(newTime);
  //   setMinutes(inputMinutes);
  //   setSeconds(0);
  //   setIsRunning(false);
  //   setShowSettings(false);
  //   clearTimerInterval();
  // };

  const handleQuickSet = (time: number): void => {
    // setInputMinutes(time);
    const newTime: number = time * 60;
    // setInitialTime(newTime);
    setTotalSeconds(newTime);
    setMinutes(time);
    setSeconds(0);
    setIsRunning(false);
    clearTimerInterval();
  };

  const toggleSettings = (): void => {
    setShowSettings(!showSettings);
  };

  const formatTime = (mins: number, secs: number): string => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className={cn(timerVariants(), className)} {...props}>
        {repeat && (
          <div className="flex w-full items-center justify-center">
            {range(repeat).map((_, index) => (
              <Smile key={index} className="mx-0.5" />
            ))}
          </div>
        )}

        <p className="text-[160px] font-bold">{formatTime(minutes, seconds)}</p>

        <div className="flex w-full max-w-[400px] items-center justify-between">
          <Select onValueChange={setSelectedTask}>
            <SelectTrigger className="w-full max-w-[340px]">
              <SelectValue placeholder="작업을 선택해주세요." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">프로그래밍1 프로젝트 작업</SelectItem>
              <SelectItem value="2">컴퓨터시스템 6장 복습</SelectItem>
            </SelectContent>

            <Dialog>
              <DialogTrigger>
                <Button variant="ghost" onClick={toggleSettings}>
                  <SlidersHorizontal />
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">타이머 설정</DialogTitle>
                </DialogHeader>

                <div className="w-full">
                  <ul className="flex w-full flex-col items-center justify-center">
                    <li className="flex w-full max-w-1/2 items-center">
                      <span className="w-1/3">반복 횟수</span>
                      <Range
                        className="w-2/3 justify-end"
                        initialValue={2}
                        gap={1}
                        min={2}
                        max={5}
                        onChange={({ value }) => setRepeat(value)}
                      />
                    </li>
                    <li className="flex w-full max-w-1/2 items-center">
                      <span className="w-1/3">집중 시간</span>
                      <Range
                        className="w-2/3 justify-end"
                        initialValue={25}
                        gap={5}
                        min={25}
                        max={120}
                        suffix="분"
                        onChange={({ value }) => handleQuickSet(value)}
                      />
                    </li>
                    <li className="flex w-full max-w-1/2 items-center">
                      <span className="w-1/2">휴식 시간</span>
                      <Range
                        className="w-2/3 justify-end"
                        initialValue={shortBreak}
                        gap={5}
                        min={shortBreak}
                        max={60}
                        suffix="분"
                        onChange={({ value }) => setShortBreak(value)}
                      />
                    </li>
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
          </Select>
        </div>

        <div className="mt-8 flex w-full justify-center">
          <Button variant={isRunning ? 'secondary' : 'destructive'} onClick={toggleTimer} disabled={!selectedTask}>
            {isRunning ? '정지' : '집중'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Timer;
