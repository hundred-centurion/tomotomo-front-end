import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shadcn/dialog.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/tooltip.tsx';
import { Button } from '@/shadcn/button.tsx';
import { SlidersHorizontal } from 'lucide-react';
import { Text } from '@/components/typography.tsx';
import { cn } from '@/lib/utils.ts';
import Range from '@/components/range.tsx';
import { useCallback, useState } from 'react';

const timerSettingDialogVariants = cva('');

type TimerSettingDialogProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof timerSettingDialogVariants> & {
    onSave: (value: [number, number, number]) => void;
    disabled?: boolean;
    repeatCountValue?: number;
    workMinutesValue?: number;
    breakMinutesValue?: number;
  };

const REPEAT_COUNT_VALUES = [2, 3, 4, 5];
const WORK_COUNT_VALUES = [25, 30, 45, 60];
const BREAK_COUNT_VALUES = [5, 10, 15, 20, 25, 30];

export default function TimerSettingDialog({ className, onSave, disabled, repeatCountValue, workMinutesValue, breakMinutesValue, ...props }: TimerSettingDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [repeatCount, setRepeatCount] = useState<number>(REPEAT_COUNT_VALUES[0]);
  const [workCount, setWorkCount] = useState<number>(WORK_COUNT_VALUES[0]);
  const [breakCount, setBreakCount] = useState<number>(BREAK_COUNT_VALUES[0]);

  const handleRepeatChange = useCallback((count: number) => {
    setRepeatCount(count);
    setIsEdit(true);
  }, []);

  const handleWorkChange = useCallback((minutes: number) => {
    setWorkCount(minutes);
    setIsEdit(true);
  }, []);

  const handleBreakChange = useCallback((minutes: number) => {
    setBreakCount(minutes);
    setIsEdit(true);
  }, []);

  const save = useCallback(() => {
    onSave([repeatCount, workCount, breakCount]);
    setOpen(false);
  }, [repeatCount, workCount, breakCount, onSave]);

  const handleOpenChange = () => {
    if (!open) {
      // Dialog가 열릴 때 부모 상태를 반영하여 초기화
      setRepeatCount(
        repeatCountValue !== undefined && REPEAT_COUNT_VALUES.includes(repeatCountValue)
          ? repeatCountValue
          : REPEAT_COUNT_VALUES[0],
      );
      setWorkCount(
        workMinutesValue !== undefined && WORK_COUNT_VALUES.includes(workMinutesValue)
          ? workMinutesValue
          : WORK_COUNT_VALUES[0],
      );
      setBreakCount(
        breakMinutesValue !== undefined && BREAK_COUNT_VALUES.includes(breakMinutesValue)
          ? breakMinutesValue
          : BREAK_COUNT_VALUES[0],
      );
      setIsEdit(false);
    } else {
      setIsEdit(false);
    }
    setOpen(!open);
  };

  return (
    <div className={cn(timerSettingDialogVariants(), className)} {...props}>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger onClick={() => setOpen(!open)} disabled={disabled}>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" disabled={disabled}>
                <SlidersHorizontal />
              </Button>
            </TooltipTrigger>

            <TooltipContent>
              <Text as="small">시간 설정</Text>
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">타이머 설정</DialogTitle>
          </DialogHeader>

          <Range values={REPEAT_COUNT_VALUES} label="반복 횟수" unit="회" initialValue={repeatCount} onValueChange={handleRepeatChange} />
          <Range values={WORK_COUNT_VALUES} label="집중 시간" unit="분" initialValue={workCount} onValueChange={handleWorkChange} />
          <Range values={BREAK_COUNT_VALUES} label="휴식 시간" unit="분" initialValue={breakCount} onValueChange={handleBreakChange} />

          <div className="flex w-full items-center justify-center">
            <Button className="w-[100px]" onClick={save} disabled={!isEdit}>
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
