/** Firestore pagination caps — keep reads bounded per request. */
export const COMMENT_PAGE_SIZE = 50;
export const PETITION_UPDATES_PAGE_SIZE = 30;
export const DASHBOARD_PETITIONS_PAGE_SIZE = 50;
export const MY_SIGNATURES_PAGE_SIZE = 100;
export const ADMIN_USERS_PAGE_SIZE = 100;
export const MODERATORS_PAGE_USER_LIST_SIZE = 100;
/** Admin moderation list — avoid unbounded getDocs on petitions. */
export const ADMIN_PETITIONS_PAGE_SIZE = 75;
