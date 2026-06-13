import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useSocket } from "./useSocket";
import { CHAT_QUERY_KEYS } from "../constants/chat-query-keys";

export function useGlobalChatSocket() {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { conversationId } = useParams<{ conversationId?: string }>();

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (message: any) => {
      // If we are already viewing this conversation, the active ChatWindow socket handler
      // (useChatSocket) will handle the cache update. We skip here to avoid duplicate refetches.
      if (conversationId && message?.conversation === conversationId) {
        return;
      }

      // Invalidate the conversations list to update preview text and sorting order
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
    };

    socket.on("chat:messageReceived", handleMessageReceived);

    return () => {
      socket.off("chat:messageReceived", handleMessageReceived);
    };
  }, [socket, queryClient, conversationId]);
}
export default useGlobalChatSocket;
