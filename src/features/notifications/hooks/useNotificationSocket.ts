import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNotificationStore } from "@/store/notificationStore";
import socket from "@/lib/socket";

import type { INotification } from "../types/notification";
import { NOTIFICATION_QUERY_KEYS } from "@/features/notifications/constants/notification-query-keys";
import { POSTS_QUERY_KEYS } from "@/features/posts/constants/posts-query-keys";

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
        queryKey: NOTIFICATION_QUERY_KEYS.list(),
      });

      // Automatically refetch the posts cache in the background so likes/comments counts update in real-time
      if (payload.type === "like" || payload.type === "comment") {
        queryClient.invalidateQueries({
          queryKey: [POSTS_QUERY_KEYS.POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [POSTS_QUERY_KEYS.POST_DETAILS],
        });
      }
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [isSocketConnected, queryClient, incrementUnread]);
};
