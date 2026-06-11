
import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "../services/getNotifications";
import type { NotificationsRequestParams } from "../types/notification";
import { NOTIFICATION_QUERY_KEYS } from "@/features/notifications/constants/notification-query-keys";

export const useInfiniteNotifications = ({
  limit = 10,
  unreadOnly = false,
}: Omit<NotificationsRequestParams, "page">) => {
  return useInfiniteQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list({ limit, unreadOnly }),
    queryFn: ({ pageParam }) =>
      getNotifications({
        page: pageParam,
        limit,
        unreadOnly,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};
