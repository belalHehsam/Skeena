import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNotificationStore } from "@/store/notificationStore";
import socket from "@/lib/socket";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type {
  INotification,
  NotificationsResponse,
} from "../types/notification";

export const useNotificationSocket = (isSocketConnected: boolean) => {
  const queryClient = useQueryClient();
  const incrementUnread = useNotificationStore(
    (state) => state.incrementUnread,
  );

  useEffect(() => {
    if (!isSocketConnected) return;

    const handleNewNotification = (payload: INotification) => {
      incrementUnread();

      queryClient.setQueryData(
        QUERY_KEYS.notifications.list({ limit: 5 }),
        (old: NotificationsResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              notifications: [payload, ...old.data.notifications.slice(0, 4)],
            },
          };
        },
      );
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [isSocketConnected, queryClient, incrementUnread]);
};
