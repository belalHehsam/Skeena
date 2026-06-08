import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CHAT_QUERY_KEYS } from "../constants/chat-query-keys";
import { markConversationRead } from "../services/markConversationRead";
import { useSocket } from "./useSocket";

export function useMarkAsRead(conversationId: string) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  return useMutation({
    mutationFn: () => markConversationRead(conversationId),
    onMutate: () => {
      if (socket && conversationId) {
        socket.emit("chat:read", { conversationId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
    },
  });
}
