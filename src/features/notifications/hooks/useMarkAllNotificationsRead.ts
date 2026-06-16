

import { useNotificationStore } from "@/store/notificationStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import i18n from "@/i18n";
import { markAllNotificationsRead } from "../services/markAllNotificationsRead";
import { NOTIFICATION_QUERY_KEYS } from "@/features/notifications/constants/notification-query-keys";

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  const resetUnreadCount = useNotificationStore(
    (state) => state.resetUnreadCount,
  );

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.list(),
      });
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
      });
      resetUnreadCount();
      toast.success(i18n.t("errors:notifications.markedAllRead"));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
