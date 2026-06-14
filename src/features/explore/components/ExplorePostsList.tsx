import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { PostCard } from "@/features/posts/components/PostCard";
import Spinner from "@/components/feedbacks/Spinner";
import ErrorMessage from "@/components/feedbacks/ErrorMessage";
import { useSearchPosts } from "../hooks/useSearchPosts";
import { FileSearch } from "lucide-react";

interface ExplorePostsListProps {
  query: string;
}


function PostSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-32 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 w-20 rounded-full bg-neutral-100 dark:bg-neutral-900" />
        </div>
      </div>
      <div className="mt-5 space-y-2.5">
        <div className="h-3 w-full rounded-full bg-neutral-100 dark:bg-neutral-900" />
        <div className="h-3 w-5/6 rounded-full bg-neutral-100 dark:bg-neutral-900" />
        <div className="h-3 w-3/4 rounded-full bg-neutral-100 dark:bg-neutral-900" />
      </div>
    </div>
  );
}


function EmptyPrompt({ query }: { query: string }) {
  const isShort = !query || query.trim().length < 2;

  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900">
        <FileSearch className="h-7 w-7 text-neutral-400" />
      </div>
      <div>
        <p className="font-semibold text-neutral-700 dark:text-neutral-300">
          {isShort ? "Search for posts" : `No results for "${query}"`}
        </p>
        <p className="mt-1 text-sm text-neutral-400">
          {isShort
            ? "Type at least 2 characters to find posts"
            : "Try different keywords or check spelling"}
        </p>
      </div>
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
  } = useSearchPosts(query);

  const { ref, inView } = useInView({ threshold: 0.1 });

  const rawPosts = data?.pages.flatMap((page) => page.data.posts) ?? [];
  const posts = Array.from(new Map(rawPosts.map((p) => [p._id, p])).values());

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) return <ErrorMessage onRetry={refetch} />;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) return <EmptyPrompt query={query} />;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} activeCategory={query} />
      ))}

      {/* Infinite scroll sentinel */}
      <div
        ref={!isLoading ? ref : null}
        className="flex h-10 items-center justify-center"
      >
        {isFetchingNextPage && <Spinner />}
        {!hasNextPage && posts.length > 0 && (
          <p className="text-xs text-neutral-400">You&apos;ve seen all results</p>
        )}
      </div>
    </div>
  );
}
