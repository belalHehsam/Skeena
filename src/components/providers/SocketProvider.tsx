import { type ReactNode, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUnreadCount } from "@/features/notifications/hooks/useUnreadCount";
import { useNotificationSocket } from "@/features/notifications/hooks/useNotificationSocket";
import { useNotificationStore } from "@/store/notificationStore";
import socket from "@/lib/socket";

import { useAuthContext } from "@/features/auth/context/AuthContext";
import { NOTIFICATION_QUERY_KEYS } from "@/features/notifications/constants/notification-query-keys";

type Props = { children: ReactNode };

function SocketProvider({ children }: Props) {
  const queryClient = useQueryClient();
  const { token, isAuthenticated } = useAuthContext();
  const [isConnected, setIsConnected] = useState(socket.connected);

  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);
  const { data: unreadData } = useUnreadCount(isAuthenticated);

  useEffect(() => {
    if (unreadData?.data.unreadCount !== undefined) {
      setUnreadCount(unreadData.data.unreadCount);
    }
  }, [unreadData, setUnreadCount]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    socket.connect();

    const onConnect = () => {
      setIsConnected(true);
      // Ensure we fetch any notifications missed while disconnected
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
    };

    const onDisconnect = () => setIsConnected(false);

    const onConnectError = (err: Error) => {
      console.error("Socket connection error:", err.message);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.disconnect();
    };
  }, [isAuthenticated, token, queryClient]);

  useNotificationSocket(isConnected);

  return <>{children}</>;
}

export default SocketProvider;
