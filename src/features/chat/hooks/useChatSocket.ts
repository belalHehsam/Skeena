import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "./useSocket";
import { CHAT_QUERY_KEYS } from "../constants/chat-query-keys";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ChatMessage } from "../types/chat";

export function useChatSocket(conversationId: string) {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket || !conversationId) return;

    // Join room
    socket.emit("chat:join", conversationId);

    // Re-join on reconnect
    const handleConnect = () => {
      socket.emit("chat:join", conversationId);
    };

    socket.on("connect", handleConnect);

    // New message handler
    const handleNewMessage = (message: ChatMessage) => {
      queryClient.setQueryData(
        CHAT_QUERY_KEYS.messages(conversationId),
        (old: any) => {
          if (!old) {
            return {
              pages: [[message]],
              pageParams: [1],
            };
          }

          // Replace optimistic message if match found, otherwise prepend
          const pages = old.pages.map((page: ChatMessage[], index: number) => {
            if (index === 0) {
              const filtered = page.filter(
                (m) =>
                  m._id !== message._id &&
                  !(m._isOptimistic && m.content === message.content)
              );
              return [message, ...filtered];
            }
            return page;
          });

          return {
            ...old,
            pages,
          };
        }
      );

      // Invalidate the conversations list to update preview text and sorting order
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
    };

    socket.on("chat:newMessage", handleNewMessage);

    // Typing handlers
    const handleUserTyping = (payload: { userId: string }) => {
      if (payload?.userId !== currentUser?.id) {
        setIsTyping(true);
      }
    };

    const handleUserStopTyping = (payload: { userId: string }) => {
      if (payload?.userId !== currentUser?.id) {
        setIsTyping(false);
      }
    };

    socket.on("chat:userTyping", handleUserTyping);
    socket.on("chat:userStopTyping", handleUserStopTyping);

    // Read receipt handler
    const handleMessageRead = () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(conversationId) });
    };

    socket.on("chat:messageRead", handleMessageRead);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("chat:newMessage", handleNewMessage);
      socket.off("chat:userTyping", handleUserTyping);
      socket.off("chat:userStopTyping", handleUserStopTyping);
      socket.off("chat:messageRead", handleMessageRead);
    };
  }, [socket, conversationId, queryClient, currentUser]);

  return { isTyping };
}
