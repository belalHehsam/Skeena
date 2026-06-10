import { useInfiniteQuery } from "@tanstack/react-query";
import { POSTS_QUERY_KEYS } from "../constants/posts-query-keys";
import { getInfinitePosts } from "../services/getInfinitePosts";
export function useGetInfinitePosts(category?: string) {
    return useInfiniteQuery({
        queryKey: [POSTS_QUERY_KEYS.POSTS, category],
        initialPageParam: 1,
        queryFn: ({ pageParam = 1, queryKey }) => {
            // Read category from queryKey to avoid stale closure issues
            const [, category] = queryKey;
            return getInfinitePosts(pageParam, category);
        },
        getNextPageParam(lastPage) {
            const { page, hasNextPage } = lastPage?.data?.pagination;
            return hasNextPage ? page + 1 : undefined;
        },
        staleTime: 1000 * 60 * 3,
    })
}

