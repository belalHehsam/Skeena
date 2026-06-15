import { useQuery } from "@tanstack/react-query";
import { EXPLORE_QUERY_KEYS } from "../constants/explore-query-keys";
import { searchUsers } from "../services/searchUsers";

const MIN_QUERY_LENGTH = 2;


export function useSearchUsers(query: string, page: number) {
  return useQuery({
    queryKey: EXPLORE_QUERY_KEYS.searchUsers(query, page),
    enabled: query.trim().length >= MIN_QUERY_LENGTH,
    queryFn: () => searchUsers(query, page),
    staleTime: 1000 * 60 * 2, // 2 minutes in-memory cache
    placeholderData: (previousData) => previousData, // keep previous page visible while loading next
  });
}
