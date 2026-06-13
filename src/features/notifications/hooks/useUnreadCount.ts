import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "../services/getUnreadCount";

import { NOTIFICATION_QUERY_KEYS } from "@/features/notifications/constants/notification-query-keys";

export const useUnreadCount = (isAuthenticated: boolean) => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
    queryFn: getUnreadCount,
    enabled: isAuthenticated,
    staleTime: Infinity,
  });
};