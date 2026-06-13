import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CHAT_QUERY_KEYS } from "../constants/chat-query-keys";
import { sendMessage } from "../services/sendMessage";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSocket } from "./useSocket";
import type { ChatMessage } from "../types/chat";
import { toast } from "sonner";

export function useSendMessage(conversationId: string, recipientId: string) {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const socket = useSocket();

  return useMutation({
    mutationFn: sendMessage,
    onMutate: async (variables) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({ queryKey: CHAT_QUERY_KEYS.messages(conversationId) });

      // Snapshot for rollback
      const prev = queryClient.getQueryData(CHAT_QUERY_KEYS.messages(conversationId));

      if (!currentUser) return { prev };

      // Optimistic message
      const optimistic: ChatMessage = {
        _id: `optimistic-${Date.now()}`,
        conversation: conversationId,
        sender: {
          _id: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
          name: currentUser.displayName || currentUser.username,
        },
        recipient: recipientId,
        content: variables.content ?? "",
        type: variables.media ? "image" : "text",
        isEdited: false,
        isDeleted: false,
        readAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _isOptimistic: true,
      };

      // If media is attached, generate a local preview URL
      if (variables.media) {
        optimistic.mediaUrl = URL.createObjectURL(variables.media);
      }

      queryClient.setQueryData(
        CHAT_QUERY_KEYS.messages(conversationId),
        (old: any) => {
          if (!old) {
            return {
              pages: [[optimistic]],
              pageParams: [1]
            };
          }
          return {
            ...old,
            pages: [
              [optimistic, ...(old.pages[0] || [])],
              ...old.pages.slice(1)
            ]
          };
        }
      );

      return { prev, optimistic };
    },
    onSuccess: (realMessage) => {
      queryClient.setQueryData(
        CHAT_QUERY_KEYS.messages(conversationId),
        (old: any) => {
          if (!old) return old;
          const pages = old.pages.map((page: ChatMessage[], index: number) => {
            if (index === 0) {
              const filtered = page.filter(
                (m) =>
                  m._id !== realMessage._id &&
                  !(m._isOptimistic && m.content === realMessage.content)
              );
              return [realMessage, ...filtered];
            }
            return page;
          });
          return {
            ...old,
            pages,
          };
        }
      );
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.optimistic) {
        queryClient.setQueryData(
          CHAT_QUERY_KEYS.messages(conversationId),
          (old: any) => {
            if (!old) return old;
            const pages = old.pages.map((page: ChatMessage[]) =>
              page.filter((m) => m._id !== ctx.optimistic._id)
            );
            return {
              ...old,
              pages,
            };
          }
        );
      }
      toast.error("Failed to send message");
    },
    onSettled: (_data, _error, _vars, ctx) => {
      if (ctx?.optimistic?.mediaUrl) {
        URL.revokeObjectURL(ctx.optimistic.mediaUrl);
      }
      // If socket is connected, the room's chat:newMessage event will handle the invalidation.
      // We only call it here if we are offline/disconnected as a fallback.
      if (!socket || !socket.connected) {
        queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
      }
    },
  });
}
