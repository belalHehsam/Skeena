import { useUnreadCount } from "@/features/notifications/hooks/useUnreadCount";
import {
  registerNotificationListeners,
  removeNotificationListeners,
} from "@/features/notifications/socket/notificationListeners";
import socket from "@/lib/socket";
import { useNotificationStore } from "@/store/notificationStore";
import { useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useEffect } from "react";

type Props = { children: ReactNode };

function SocketProvider({ children }: Props) {
  const user = localStorage.getItem("token");
  // const user = null;
  const queryClient = useQueryClient();
  const incrementUnread = useNotificationStore(
    (state) => state.incrementUnread,
  );
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);
  const { data: unreadData } = useUnreadCount(!!user);
  console.log("provider reRendered");

  useEffect(() => {
    if (unreadData?.data.unreadCount !== undefined) {
      setUnreadCount(unreadData.data.unreadCount);
    }
  }, [unreadData, setUnreadCount]);

  useEffect(() => {
    if (!user) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    registerNotificationListeners(incrementUnread, queryClient);

    socket.on("connect_error", (err) => {
      console.log("Connection error occurred: ", err.message);
    });

    return () => {
      removeNotificationListeners();
      socket.disconnect();
    };
  }, [user, incrementUnread, queryClient]);

  return <>{children}</>;
}

export default SocketProvider;
