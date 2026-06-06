import type { NotificationsRequestParams } from "@/features/notifications/types/notification";

export const QUERY_KEYS = {
  notifications: {
    all: () => ["notifications"] as const,
    list: (params?: NotificationsRequestParams) =>
      ["notifications", "list", ...Object.values(params || {})] as const,
    unreadCount: () => ["notifications", "unread-count"] as const,
  },
  posts: {
    all: () => ["posts"] as const,
    post: (id: string) => ["posts", id] as const,
  },
  users: {
    profile: (id: string) => ["users", id] as const,
  },
};