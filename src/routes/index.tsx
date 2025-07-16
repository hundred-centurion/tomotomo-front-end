import { createFileRoute } from '@tanstack/react-router';
import IndexLayout from '@/components/layouts/index-layout.tsx';
import TitledContainer from '@/components/titled-container.tsx';
import DateRange from '@/components/date-range.tsx';
import { type CardProps } from '@/components/card.tsx';
import CardContainer from '@/components/card-container.tsx';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Label } from '@/components/ui/label.tsx';

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.005, // 글자 간 시간 간격
    },
  },
};

const child = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: '0%', opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const CARDS: CardProps[] = [
  {
    title: '총 집중 시간',
    contentInfo: '토모토모와 함께한 첫 순간부터 지금까지 {nickname}님이 집중한 시간이에요.',
    children: (
      <motion.div className="mt-3 flex justify-end" variants={container} initial="hidden" animate="visible">
        {'60시간 25분'.split('').map((char, index) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          <motion.span key={index} variants={child}>
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>
    ),
    className: 'w-[33.333%]',
  },
  {
    title: '오늘의 집중 시간',
    contentInfo: '{nickname}님이 {N월 N일}에집중한 시간이에요.',
    children: (
      <motion.div className="mt-3 flex justify-end" variants={container} initial="hidden" animate="visible">
        {'5시간 25분'.split('').map((char, index) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          <motion.span key={index} variants={child}>
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>
    ),
    className: 'w-[33.333%]',
  },
  {
    title: '할 일 목록',
    children: (
      <motion.div
        className="mt-3 flex flex-col justify-end gap-2"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {[
          <div className="flex gap-2">
            <Checkbox id="1" />
            <Label htmlFor="1">미디어제작 로고 제작</Label>
          </div>,
          <div className="flex gap-2">
            <Checkbox id="2" />
            <Label htmlFor="2">컴퓨터시스템 6장 복습</Label>
          </div>,
        ].map((node, index) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          <motion.div key={index} variants={child}>
            {node}
          </motion.div>
        ))}
      </motion.div>
    ),
    className: 'w-[33.333%]',
  },
];

const IndexPage = () => {
  return (
    <IndexLayout>
      <TitledContainer title="Home" titleSize="h2" actions={[<DateRange />]}>
        <CardContainer values={CARDS} className="mt-3 gap-2" />
      </TitledContainer>
    </IndexLayout>
  );
};

export const Route = createFileRoute('/')({
  component: IndexPage,
});
