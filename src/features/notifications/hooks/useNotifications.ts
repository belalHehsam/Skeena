import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../services/getNotifications";

import type { NotificationsRequestParams } from "../types/notification";
import { NOTIFICATION_QUERY_KEYS } from "@/features/notifications/constants/notification-query-keys";

export const useNotifications = (params?: NotificationsRequestParams) => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list(params),
    queryFn: () => getNotifications(params),
    staleTime: Infinity,
  });
};
