import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Sparkles } from "lucide-react";
import { PostCard } from "@/features/posts/components/PostCard";
import { POSTS_QUERY_KEYS } from "@/features/posts/constants/posts-query-keys";
import { useGetInfinitePosts } from "@/features/posts/hooks/useGetInfinitePosts";
import Spinner from "@/components/feedbacks/Spinner";
import ErrorMessage from "@/components/feedbacks/ErrorMessage";
import { PostSkeletonList } from "./PostSkeleton";
import { PostsEmptyPrompt } from "./PostsEmptyPrompt";

interface ExplorePostsListProps {
  query: string;
}

/** Shows a summary line when an active search query returned results. */
function ResultsHeader({ query, count }: { query: string; count: number }) {
  if (!query || query.trim().length < 2) return null;
  return (
    <div className="mb-4 flex items-center gap-2">
      <Sparkles className="h-4 w-4 text-primary" />
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Showing results for{" "}
        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
          &ldquo;{query}&rdquo;
        </span>
        {count > 0 && <span className="ml-1 text-neutral-400">· {count} found</span>}
      </p>
    </div>
  );
}

export function ExplorePostsList({ query }: ExplorePostsListProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetInfinitePosts(undefined, query, query.trim().length >= 2);

  const { ref, inView } = useInView({ threshold: 0.1 });

  const rawPosts = data?.pages.flatMap((page) => page.data.posts) ?? [];
  const posts = Array.from(new Map(rawPosts.map((p) => [p._id, p])).values());

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) return <ErrorMessage onRetry={refetch} />;
  if (isLoading) return <PostSkeletonList />;
  if (posts.length === 0) return <PostsEmptyPrompt query={query} />;

  return (
    <div className="space-y-4">
      <ResultsHeader query={query} count={posts.length} />

      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          cacheQueryKey={[POSTS_QUERY_KEYS.POSTS, undefined, query]}
        />
      ))}

      {/* Infinite scroll sentinel */}
      <div ref={!isLoading ? ref : null} className="flex h-12 items-center justify-center">
        {isFetchingNextPage && <Spinner />}
        {!hasNextPage && posts.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="inline-block h-px w-12 bg-neutral-200 dark:bg-neutral-800" />
            You&apos;ve seen all results
            <span className="inline-block h-px w-12 bg-neutral-200 dark:bg-neutral-800" />
          </div>
        )}
      </div>
    </div>
  );
}
