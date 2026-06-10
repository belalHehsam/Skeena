import { useSocket } from "@/features/chat/context/SocketContext";

export function useVoiceSocket() {
  return useSocket();
}
