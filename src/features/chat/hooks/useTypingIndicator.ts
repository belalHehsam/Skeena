import { useCallback, useRef } from "react";
import { useSocket } from "./useSocket";

export function useTypingIndicator(conversationId: string) {
  const socket = useSocket();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emitTyping = useCallback(() => {
    if (!socket || !conversationId) return;

    socket.emit("chat:typing", { conversationId });

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      socket.emit("chat:stopTyping", { conversationId });
      timerRef.current = null;
    }, 2000);
  }, [socket, conversationId]);

  return { emitTyping };
}
