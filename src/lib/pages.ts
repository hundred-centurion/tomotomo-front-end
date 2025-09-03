export const INDEX_PAGE = '/' as const;

export const TIMER_PAGE = '/timer' as const;

export const TODO_PAGE = '/todo' as const;

export const FAQ_PAGE = '/faq' as const;

export const SIGN_UP_PAGE = '/sign-up' as const;

export const SIGN_IN_PAGE = '/sign-in' as const;

export const EMAIL_VERIFICATION_PAGE = '/email-verification' as const;

export const RESET_PASSWORD = '/reset-password' as const;

export const PAGES = [INDEX_PAGE, TIMER_PAGE, TODO_PAGE, FAQ_PAGE] as const;

export type Pages = (typeof PAGES)[number];

export const PAGE_MAP: Record<Pages, string> = {
  '/': '홈',
  '/timer': '타이머',
  '/todo': '할 일 목록',
  '/faq': '자주 묻는 질문',
};
