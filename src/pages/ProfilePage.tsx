import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PrivateProfileState } from "@/features/profile/components/PrivateProfileState";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfilePosts } from "@/features/profile/components/ProfilePosts";
import { PROFILE_QUERY_KEYS } from "@/features/profile/constants/profile-query-keys";
import { useProfilePosts } from "@/features/profile/hooks/useProfilePosts";
import ErrorMessage from "@/components/feedbacks/ErrorMessage";
import { ProfileHeaderSkeleton } from "@/features/profile/components/ProfileHeaderSkeleton";
import { PostSkeletonList } from "@/features/explore/components/PostSkeleton";

export default function ProfilePage() {
    const { id } = useParams<{ id?: string }>();
    const { user: currentUser } = useAuth();

    const isOwnProfile = !id || id === currentUser?.id;
    const requestedUserId = isOwnProfile ? undefined : id;
    const profileKey = requestedUserId ?? "me";
    const profileQuery = useProfilePosts(requestedUserId);
    const profileUser = profileQuery.data?.pages[0]?.user;

    const posts = useMemo(() => {
        const allPosts =
            profileQuery.data?.pages.flatMap((page) => page.posts) ?? [];

        return Array.from(
            new Map(allPosts.map((post) => [post._id, post])).values(),
        );
    }, [profileQuery.data]);

    if (profileQuery.isPending) {
        return (
            <div className="mx-auto w-full max-w-5xl space-y-6 pb-8">
                <ProfileHeaderSkeleton />
                <PostSkeletonList count={2} />
            </div>
        );
    }

    if (profileQuery.isError || !profileUser) {
        return (
            <ErrorMessage
                onRetry={() => {
                    profileQuery.refetch();
                }}
            />
        );
    }

    const totalPosts = profileQuery.data.pages[0].pagination.total;
    const isPrivateProfile = !isOwnProfile && profileUser.isPrivate;

    return (
        <div className="mx-auto animate-fade-in w-full max-w-5xl space-y-6 pb-8">
            <ProfileHeader
                user={profileUser}
                isOwnProfile={isOwnProfile}
                postsCount={totalPosts}
            />

            {isPrivateProfile ? (
                <PrivateProfileState />
            ) : (
                <ProfilePosts
                    posts={posts}
                    total={totalPosts}
                    cacheQueryKey={PROFILE_QUERY_KEYS.detail(profileKey)}
                    hasNextPage={Boolean(profileQuery.hasNextPage)}
                    isFetchingNextPage={profileQuery.isFetchingNextPage}
                    onLoadMore={() => {
                        profileQuery.fetchNextPage();
                    }}
                />
            )}
        </div>
    );
}
