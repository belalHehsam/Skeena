import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEYS } from "@/features/auth/constants/auth-query-keys";
import type { MePayload } from "@/features/auth/types/auth";
import { PROFILE_QUERY_KEYS } from "@/features/profile/constants/profile-query-keys";
import type {
    ProfilePageData,
    ProfileUser,
} from "@/features/profile/types/profile";

export function mergeUserIntoAuthCache(
    queryClient: QueryClient,
    updatedUser: ProfileUser,
) {
    queryClient.setQueryData<MePayload>(AUTH_QUERY_KEYS.me, (current) => {
        if (!current) {
            return current;
        }

        return {
            user: {
                ...current.user,
                ...updatedUser,
                settings: updatedUser.settings ?? current.user.settings,
            },
        };
    });
}

export function mergeUserIntoOwnProfileCache(
    queryClient: QueryClient,
    updatedUser: ProfileUser,
) {
    queryClient.setQueryData<InfiniteData<ProfilePageData, number>>(
        PROFILE_QUERY_KEYS.detail("me"),
        (current) => {
            if (!current) {
                return current;
            }

            return {
                ...current,
                pages: current.pages.map((page) => ({
                    ...page,
                    user: {
                        ...page.user,
                        ...updatedUser,
                        settings: updatedUser.settings ?? page.user.settings,
                    },
                })),
            };
        },
    );
}