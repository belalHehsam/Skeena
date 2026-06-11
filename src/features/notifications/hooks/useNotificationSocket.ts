import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNotificationStore } from "@/store/notificationStore";
import socket from "@/lib/socket";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { INotification } from "../types/notification";

export const useNotificationSocket = (isSocketConnected: boolean) => {
  const queryClient = useQueryClient();
  const incrementUnread = useNotificationStore(
    (state) => state.incrementUnread,
  );

  useEffect(() => {
    if (!isSocketConnected) return;

    const handleNewNotification = (payload: INotification) => {
      if (!payload.isRead) {
        incrementUnread();
      }

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.notifications.list(),
      });
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [isSocketConnected, queryClient, incrementUnread]);
};
