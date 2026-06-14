import { useInfiniteQuery } from "@tanstack/react-query";
import { POSTS_QUERY_KEYS } from "../constants/posts-query-keys";
import { getInfinitePosts } from "../services/getInfinitePosts";
export function useGetInfinitePosts(category?: string, search?: string, enabled = true) {
    return useInfiniteQuery({
        queryKey: [POSTS_QUERY_KEYS.POSTS, category, search],
        enabled,
        initialPageParam: 1,
        queryFn: ({ pageParam = 1, queryKey }) => {
            // Read category and search from queryKey to avoid stale closure issues
            const [, category, search] = queryKey;
            return getInfinitePosts(pageParam, category, search);
        },
        getNextPageParam(lastPage) {
            const { page, hasNextPage } = lastPage?.data?.pagination;
            return hasNextPage ? page + 1 : undefined;
        },
        staleTime: 1000 * 60 * 3,
    })
}

