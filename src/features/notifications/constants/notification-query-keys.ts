import type { NotificationsRequestParams } from "../types/notification";

export const NOTIFICATION_QUERY_KEYS = {
  all: ["notifications"] as const,
  list: (params?: NotificationsRequestParams) =>
    ["notifications", "list", ...Object.values(params || {})] as const,
  unreadCount: ["notifications", "unread-count"] as const,
};
