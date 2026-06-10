import { useQuery } from "@tanstack/react-query";
import { CHAT_QUERY_KEYS } from "../constants/chat-query-keys";
import { getConversations } from "../services/getConversations";

export function useGetConversations() {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.conversations(),
    queryFn: getConversations,
    staleTime: 30_000,
  });
}
