import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CHAT_QUERY_KEYS } from "../constants/chat-query-keys";
import { sendMessage } from "../services/sendMessage";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ChatMessage } from "../types/chat";
import { toast } from "sonner";

export function useSendMessage(conversationId: string, recipientId: string) {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

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
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(CHAT_QUERY_KEYS.messages(conversationId), ctx?.prev);
      toast.error("Failed to send message");
    },
    onSettled: (_data, _error, _vars, ctx) => {
      if (ctx?.optimistic?.mediaUrl) {
        URL.revokeObjectURL(ctx.optimistic.mediaUrl);
      }
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(conversationId) });
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
    },
  });
}
