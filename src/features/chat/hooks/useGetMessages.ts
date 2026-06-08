import { useInfiniteQuery } from "@tanstack/react-query";
import { CHAT_QUERY_KEYS } from "../constants/chat-query-keys";
import { getMessages } from "../services/getMessages";

export function useGetMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: CHAT_QUERY_KEYS.messages(conversationId),
    queryFn: ({ pageParam = 1 }) => getMessages(conversationId, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 20 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    enabled: Boolean(conversationId),
  });
}
