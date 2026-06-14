import { useInfiniteQuery } from "@tanstack/react-query";
import { EXPLORE_QUERY_KEYS } from "../constants/explore-query-keys";
import { searchPosts } from "../services/searchPosts";

const MIN_QUERY_LENGTH = 2;


export function useSearchPosts(query: string) {
  return useInfiniteQuery({
    queryKey: EXPLORE_QUERY_KEYS.searchPosts(query),
    enabled: query.trim().length >= MIN_QUERY_LENGTH,
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => searchPosts(query, pageParam),
    getNextPageParam(lastPage) {
      const { page, hasNextPage } = lastPage.data.pagination;
      return hasNextPage ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes in-memory cache
  });
}
