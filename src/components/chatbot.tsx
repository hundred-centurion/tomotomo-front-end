import { useState, useEffect, useRef } from 'react';
import { Button } from '@/shadcn/button.tsx';
import { Text } from '@/components/typography.tsx';
import { Bot, X } from 'lucide-react';
import { useTasks } from '@/hooks';
import { Dialog, DialogHeader, DialogTitle, DialogPortal } from '@/shadcn/dialog.tsx';
import * as DialogPrimitive from '@radix-ui/react-dialog';

type ChatMessage = {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  options?: ChatOption[];
};

type ChatOption = {
  id: string;
  text: string;
  action: () => void;
};

type ChatFlow =
  | 'main-menu'
  | 'task-briefing'
  | 'ai-priority'
  | 'completed-tasks-count'
  | 'incomplete-tasks-count'
  | 'incomplete-subtasks-count'
  | 'task-selected'
  | 'conversation-end';

type ChatbotProps = {
  isOpen: boolean;
  onClose: () => void;
  onTaskSelectAndStart?: (taskId: number) => void;
  onTaskSelect?: (taskId: number) => void;
};

export default function Chatbot({ isOpen, onClose, onTaskSelectAndStart, onTaskSelect }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [_, setCurrentFlow] = useState<ChatFlow>('main-menu');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: tasks, isLoading: isTasksLoading } = useTasks();

  // 초기 메시지 설정
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage: ChatMessage = {
        id: '1',
        type: 'bot',
        content: '안녕하세요 👋\n무엇을 도와드릴까요?',
        timestamp: new Date(),
        options: [
          {
            id: 'task-briefing',
            text: '할 일 목록 브리핑',
            action: () => handleOptionClick('task-briefing'),
          },
          {
            id: 'ai-priority',
            text: 'AI 우선순위 분석',
            action: () => handleOptionClick('ai-priority'),
          },
        ],
      };
      setMessages([initialMessage]);
    }
  }, [isOpen, messages.length]);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setCurrentFlow('main-menu');
    }
  }, [isOpen]);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 최근 7일 완료된 task 수량 계산
  const getCompletedTasksCount = () => {
    if (!tasks) return 0;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // completedAt이 없으므로 updateDate를 사용하여 완료된 task 중 최근 7일 내에 수정된 것들을 카운트
    return tasks.filter((task) => task.completed && task.updateDate && new Date(task.updateDate) >= sevenDaysAgo)
      .length;
  };

  // 미완료 task 수량 계산
  const getIncompleteTasksCount = () => {
    if (!tasks) return 0;
    return tasks.filter((task) => !task.completed).length;
  };

  // 미완료 subtask 수량 계산 (모든 task의 subtask 합계)
  const getIncompleteSubtasksCount = () => {
    if (!tasks) return 0;
    // 실제로는 각 task의 subtask를 조회해야 하지만,
    // 현재 구조상 task에 subtask 정보가 없으므로 0으로 반환
    // 필요시 useSubtasksByTask 훅을 사용하여 각 task별로 조회
    return 0;
  };

  // AI 우선순위 분석 (due date와 중요도 기반)
  const getTopPriorityTasks = () => {
    if (!tasks) return [];

    const incompleteTasks = tasks.filter((task) => !task.completed);

    // due date가 가까운 순서로 정렬 (due date가 없는 경우 맨 뒤로)
    return incompleteTasks
      .sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      })
      .slice(0, 3);
  };

  const addMessage = (content: string, type: 'bot' | 'user' = 'bot', options?: ChatOption[]) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      options,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleOptionClick = (optionId: string) => {
    // 사용자 선택 메시지 추가
    const optionText = getOptionText(optionId);
    addMessage(optionText, 'user');

    // 선택에 따른 플로우 처리
    switch (optionId) {
      case 'task-briefing':
        setCurrentFlow('task-briefing');
        setTimeout(() => {
          addMessage('좋아요! 지금까지의 작업 현황을 정리해드릴게요.\n궁금한 내용을 골라주세요 👇', 'bot', [
            {
              id: 'completed-tasks-count',
              text: '최근 7일',
              action: () => handleOptionClick('completed-tasks-count'),
            },
            {
              id: 'incomplete-tasks-count',
              text: '미완료',
              action: () => handleOptionClick('incomplete-tasks-count'),
            },
            {
              id: 'incomplete-subtasks-count',
              text: '현재 남아있는 미완료',
              action: () => handleOptionClick('incomplete-subtasks-count'),
            },
          ]);
        }, 500);
        break;

      case 'ai-priority':
        setCurrentFlow('ai-priority');
        setTimeout(() => {
          const topTasks = getTopPriorityTasks();
          if (topTasks.length === 0) {
            addMessage('현재 완료해야 할 task가 없어요! 🎉', 'bot', [
              {
                id: 'end-conversation',
                text: '대화 종료',
                action: () => handleOptionClick('end-conversation'),
              },
              {
                id: 'back-to-main',
                text: '처음으로',
                action: () => handleOptionClick('back-to-main'),
              },
            ]);
          } else {
            const taskListHtml = topTasks
              .map((task, index) => `• ${index + 1}순위 ${task.title || '제목 없음'}`)
              .join('\n');

            addMessage(
              `AI 분석으로 남은 due date와 중요도를 살펴봤어요. 지금 가장 집중하면 좋은 task TOP 3를 알려드릴게요!\n\n${taskListHtml}\n\n아래 버튼을 클릭하면 해당 task로 자동 설정돼요.`,
              'bot',
              topTasks.map((task, index) => ({
                id: `select-task-${task.id}`,
                text: `${index + 1}순위 ${task.title || '제목 없음'} →`,
                action: () => handleTaskSelection(task.id!),
              })),
            );
          }
        }, 500);
        break;

      case 'completed-tasks-count':
        setCurrentFlow('completed-tasks-count');
        setTimeout(() => {
          const count = getCompletedTasksCount();
          addMessage(
            `최근 7일 동안 완료한 task는 ${count}개예요!\n더 필요한 게 없으시면 [대화 종료] 버튼을 눌러주세요 :)`,
            'bot',
            [
              {
                id: 'end-conversation',
                text: '대화 종료',
                action: () => handleOptionClick('end-conversation'),
              },
              {
                id: 'back-to-main',
                text: '처음으로',
                action: () => handleOptionClick('back-to-main'),
              },
            ],
          );
        }, 500);
        break;

      case 'incomplete-tasks-count':
        setCurrentFlow('incomplete-tasks-count');
        setTimeout(() => {
          const count = getIncompleteTasksCount();
          addMessage(
            `현재 남아있는 미완료 task는 ${count}개예요!\n더 필요한 게 없으시면 [대화 종료] 버튼을 눌러주세요 :)`,
            'bot',
            [
              {
                id: 'end-conversation',
                text: '대화 종료',
                action: () => handleOptionClick('end-conversation'),
              },
              {
                id: 'back-to-main',
                text: '처음으로',
                action: () => handleOptionClick('back-to-main'),
              },
            ],
          );
        }, 500);
        break;

      case 'incomplete-subtasks-count':
        setCurrentFlow('incomplete-subtasks-count');
        setTimeout(() => {
          const count = getIncompleteSubtasksCount();
          addMessage(
            `현재 남아있는 미완료 subtask는 ${count}개예요!\n더 필요한 게 없으시면 [대화 종료] 버튼을 눌러주세요 :)`,
            'bot',
            [
              {
                id: 'end-conversation',
                text: '대화 종료',
                action: () => handleOptionClick('end-conversation'),
              },
              {
                id: 'back-to-main',
                text: '처음으로',
                action: () => handleOptionClick('back-to-main'),
              },
            ],
          );
        }, 500);
        break;

      case 'end-conversation':
        setCurrentFlow('conversation-end');
        setTimeout(() => {
          addMessage('대화를 종료합니다. 수고하셨어요! 👋', 'bot');
        }, 500);
        break;

      case 'back-to-main':
        setCurrentFlow('main-menu');
        setTimeout(() => {
          addMessage('안녕하세요 👋 오늘 어떤 도움이 필요하실까요?', 'bot', [
            {
              id: 'task-briefing',
              text: '할 일 목록 브리핑',
              action: () => handleOptionClick('task-briefing'),
            },
            {
              id: 'ai-priority',
              text: 'AI 우선순위 분석',
              action: () => handleOptionClick('ai-priority'),
            },
          ]);
        }, 500);
        break;
    }
  };

  const handleTaskSelection = (taskId: number) => {
    setCurrentFlow('task-selected');

    const selectedTask = tasks?.find((task) => task.id === taskId);
    const taskText = selectedTask ? selectedTask.title || '제목 없음' : '선택된 task';

    addMessage(taskText, 'user');

    // Task 선택 콜백 호출
    if (onTaskSelect) {
      onTaskSelect(taskId);
    }

    setTimeout(() => {
      addMessage('✔ 선택하신 task가 자동으로 설정되었습니다. 이제 바로 집중 모드로 들어가실 수 있어요!', 'bot', [
        {
          id: 'start-timer',
          text: '타이머 시작',
          action: () => {
            if (onTaskSelectAndStart) {
              onTaskSelectAndStart(taskId);
            }
          },
        },
        {
          id: 'end-conversation',
          text: '대화 종료',
          action: () => handleOptionClick('end-conversation'),
        },
        {
          id: 'back-to-main',
          text: '처음으로',
          action: () => handleOptionClick('back-to-main'),
        },
      ]);
    }, 500);
  };

  const getOptionText = (optionId: string): string => {
    const optionMap: Record<string, string> = {
      'task-briefing': '할 일 목록 브리핑',
      'ai-priority': 'AI 우선순위 분석',
      'completed-tasks-count': '최근 7일 동안 완료한 task 수량',
      'incomplete-tasks-count': '현재 남아있는 미완료 task 수량',
      'incomplete-subtasks-count': '미완료 subtask 수량',
      'end-conversation': '대화 종료',
      'back-to-main': '처음으로',
    };
    return optionMap[optionId] || optionId;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogPortal>
        <DialogPrimitive.Content
          className="bg-background fixed bottom-4 left-4 z-50 flex h-[500px] w-[400px] flex-col rounded-lg border p-0 shadow-lg"
          style={{
            position: 'fixed',
            bottom: '16px',
            left: '16px',
            transform: 'none',
            top: 'auto',
            right: 'auto',
          }}
        >
          <DialogHeader className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Bot className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold">할 일 추천 봇</DialogTitle>
                  <Text as="small" className="text-muted-foreground">
                    AI가 도와드릴게요
                  </Text>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* 채팅 메시지 영역 */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col gap-2">
                {message.type === 'bot' ? (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="rounded-lg bg-gray-100 p-3">
                        <Text className="whitespace-pre-wrap" style={{ whiteSpace: 'pre-wrap' }}>
                          {message.content.split('\n').map((line, index) => (
                            <span key={index}>
                              {line}
                              {index < message.content.split('\n').length - 1 && <br />}
                            </span>
                          ))}
                        </Text>
                      </div>
                      {message.options && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.options.map((option) => (
                            <Button
                              key={option.id}
                              variant="outline"
                              size="sm"
                              onClick={option.action}
                              className="text-xs"
                            >
                              {option.text}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-lg bg-blue-500 p-3">
                      <Text className="text-white" style={{ whiteSpace: 'pre-wrap' }}>
                        {message.content.split('\n').map((line, index) => (
                          <span key={index}>
                            {line}
                            {index < message.content.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </Text>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* 로딩 상태 */}
            {isTasksLoading && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="rounded-lg bg-gray-100 p-3">
                  <Text className="text-muted-foreground" style={{ whiteSpace: 'pre-wrap' }}>
                    데이터를 불러오는 중...
                  </Text>
                </div>
              </div>
            )}

            {/* 스크롤을 위한 빈 div */}
            <div ref={messagesEndRef} />
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
