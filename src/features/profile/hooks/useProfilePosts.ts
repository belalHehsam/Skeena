import { useInfiniteQuery } from "@tanstack/react-query";
import { PROFILE_QUERY_KEYS } from "@/features/profile/constants/profile-query-keys";
import { getProfilePage } from "@/features/profile/services/getProfilePage";

const PROFILE_POSTS_LIMIT = 10;

export function useProfilePosts(userId?: string) {
    const profileKey = userId ?? "me";

    return useInfiniteQuery({
        queryKey: PROFILE_QUERY_KEYS.detail(profileKey),
        initialPageParam: 1,

        queryFn: ({ pageParam }) =>
            getProfilePage({
                userId,
                page: pageParam,
                limit: PROFILE_POSTS_LIMIT,
            }),

        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.pagination;

            return page < totalPages ? page + 1 : undefined;
        },

        staleTime: 2 * 60 * 1000,
    });
}