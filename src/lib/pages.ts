export const INDEX_PAGE = '/' as const;

export const HOME_PAGE = '/home' as const;

export const TIMER_PAGE = '/timer' as const;

export const TASKS_PAGE = '/tasks' as const;

export const FAQ_PAGE = '/faq' as const;

export const SIGN_UP_PAGE = '/sign-up' as const;

export const LOG_IN_PAGE = '/log-in' as const;

export const EMAIL_VERIFICATION_PAGE = '/email-verification' as const;

export const RESET_PASSWORD = '/reset-password' as const;

export const PAGES = [INDEX_PAGE, TIMER_PAGE, TASKS_PAGE] as const;

export type Pages = (typeof PAGES)[number];

export const PAGE_MAP: Record<Pages, string> = {
  '/': '홈',
  '/timer': '타이머',
  '/tasks': '할 일 목록',
};
