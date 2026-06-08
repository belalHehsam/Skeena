import { useSocket as useSocketFromContext } from "../context/SocketContext";

export function useSocket() {
  return useSocketFromContext();
}
