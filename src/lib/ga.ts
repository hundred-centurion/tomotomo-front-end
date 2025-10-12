import ReactGA from 'react-ga4';

export type Events =
  | 'add_todo'
  | 'complete_todo'
  | 'start_todo_timer'
  | 'delete_todo'
  | 'request_ai_analysis'
  | 'view_ai_report'
  | 'click_download'
  | 'start_timer'
  | 'pause_timer'
  | 'reset_timer'
  | 'change_settings';

// GA 이벤트 전송 함수
export function sendGAEvent(event: Events, parameters?: Record<string, string | number | boolean>) {
  try {
    ReactGA.event({
      action: event,
      category: 'user_interaction',
      ...parameters,
    });
  } catch (error) {
    console.warn('GA 이벤트 전송 실패:', error);
  }
}

// 특정 이벤트들을 위한 헬퍼 함수들
export const GAEvents = {
  // 할 일 관련 이벤트
  addTodo: () => sendGAEvent('add_todo'),
  completeTodo: () => sendGAEvent('complete_todo'),
  startTodoTimer: () => sendGAEvent('start_todo_timer'),
  deleteTodo: () => sendGAEvent('delete_todo'),
  
  // AI 분석 관련 이벤트
  requestAIAnalysis: () => sendGAEvent('request_ai_analysis'),
  viewAIReport: () => sendGAEvent('view_ai_report'),
  
  // 다운로드 이벤트
  clickDownload: (contentType: 'report' | 'todo_list') => 
    sendGAEvent('click_download', { content_type: contentType }),
  
  // 타이머 관련 이벤트
  startTimer: (timerType: 'pomodoro') => 
    sendGAEvent('start_timer', { timer_type: timerType }),
  pauseTimer: (timerType: 'pomodoro') => 
    sendGAEvent('pause_timer', { timer_type: timerType }),
  resetTimer: (timerType: 'pomodoro') => 
    sendGAEvent('reset_timer', { timer_type: timerType }),
  
  // 설정 변경 이벤트
  changeSettings: (settingType: 'pomodoro_duration') => 
    sendGAEvent('change_settings', { setting_type: settingType }),
};
