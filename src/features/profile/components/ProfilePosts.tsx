import type { QueryKey } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import Spinner from "@/components/feedbacks/Spinner";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/features/posts/components/PostCard";
import type { Post } from "@/features/posts/types/post";

type ProfilePostsProps = {
    posts: Post[];
    total: number;
    cacheQueryKey: QueryKey;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onLoadMore: () => void;
};

export function ProfilePosts({
    posts,
    total,
    cacheQueryKey,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
}: ProfilePostsProps) {
    const { t } = useTranslation("profile");

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-3 px-1">
                <h2 className="font-heading text-lg font-semibold">
                    {t("posts.title")}
                </h2>

                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {t("posts.count", {
                        count: total,
                    })}
                </span>
            </div>

            {posts.length === 0 ? (
                <div className="rounded-2xl border border-neutral-200 bg-card px-6 py-12 text-center shadow-sm dark:border-neutral-800">
                    <FileText className="mx-auto size-8 text-neutral-400" />

                    <h3 className="mt-3 font-heading text-base font-semibold">
                        {t("posts.emptyTitle")}
                    </h3>

                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {t("posts.emptyDescription")}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            cacheQueryKey={cacheQueryKey}
                        />
                    ))}
                </div>
            )}

            {hasNextPage && (
                <div className="flex justify-center pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={onLoadMore}
                        disabled={isFetchingNextPage}
                        className="min-w-32 rounded-full"
                    >
                        {isFetchingNextPage ? (
                            <Spinner />
                        ) : (
                            t("posts.loadMore")
                        )}
                    </Button>
                </div>
            )}
        </section>
    );
}