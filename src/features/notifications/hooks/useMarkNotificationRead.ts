
import { useNotificationStore } from "@/store/notificationStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationRead } from "../services/markNotificationRead";
import { NOTIFICATION_QUERY_KEYS } from "@/features/notifications/constants/notification-query-keys";

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  const decrementUnread = useNotificationStore(
    (state) => state.decrementUnread,
  );

  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.list(),
      });
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
      });
      decrementUnread();
    },
  });
};
