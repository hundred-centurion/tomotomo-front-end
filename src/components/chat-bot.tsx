import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils.ts';
import { BotMessageSquare } from 'lucide-react';

const chatBotVariants = cva('w-[45px] h-[45px] absolute left-[20px] bottom-[20px] flex justify-center items-center');

type ChatBotProps = Omit<React.ComponentProps<'div'>, 'children'> & VariantProps<typeof chatBotVariants> & {};

const ChatBot: React.FC<ChatBotProps> = ({ className, ...props }) => {
  return (
    <div className={cn(chatBotVariants(), className)} {...props}>
      <BotMessageSquare />
    </div>
  );
};

export default ChatBot;
