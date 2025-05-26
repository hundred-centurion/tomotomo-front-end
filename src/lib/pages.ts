export const INDEX_PAGE = '/' as const;

export const TIMER_PAGE = '/timer' as const;

export const TODO_PAGE = '/todo' as const;

export const FAQ_PAGE = '/faq' as const;

export const AUTH_PAGE = '/auth' as const;

export const SIGN_UP_PAGE = `${AUTH_PAGE}/sign-up` as const;

export const SIGN_IN_PAGE = `${AUTH_PAGE}/sign-in` as const;

export const HEADER_PAGES = [INDEX_PAGE, TIMER_PAGE, TODO_PAGE, FAQ_PAGE] as const;

export type HeaderPage = (typeof HEADER_PAGES)[number];
