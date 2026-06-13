import { useGetInfinitePosts } from "../hooks/useGetInfinitePosts";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import Spinner from "@/components/feedbacks/Spinner";
import ErrorMessage from "@/components/feedbacks/ErrorMessage";
import { PostCard } from "./PostCard";
import CategoryFilters from "./CategoryFilters";
import CreatePostTrigger from "./CreatePostTrigger";
export default function AllPosts() {
  const [activeCategory, setActiveCategory] = useState("all");
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetInfinitePosts(activeCategory);

  const { ref, inView } = useInView({ threshold: 0.1 });

  const rawPosts = data?.pages.flatMap((page) => page.data.posts || []) || [];
  const allPosts = Array.from(
    new Map(rawPosts.map((post) => [post._id, post])).values(),
  );

  useEffect(() => {
    //make sure we have another pages
    //make sure we reached to the last post
    //make sure we don't fetch page now
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return <ErrorMessage onRetry={refetch} />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      {/* render Active Dev  */}
      <CategoryFilters
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <CreatePostTrigger />
      {isLoading ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner />
        </div>
      ) : null}

      {allPosts.length === 0 && !isLoading && !hasNextPage && (
        <p className="py-10 text-center text-gray-500">
          {`No Posts in ${activeCategory} category`}
        </p>
      )}

      {/* render posts */}
      {allPosts.map((post) => (
        <PostCard
          key={`${post._id}${activeCategory}`}
          post={post}
          activeCategory={activeCategory}
        />
      ))}

      <div
        ref={!isLoading ? ref : null}
        className="mt-4 flex h-12 items-center justify-center"
      >
        {isFetchingNextPage && <Spinner />}
        {!hasNextPage && allPosts.length > 0 && (
          <p className="text-sm font-medium text-gray-400">No More Posts</p>
        )}
      </div>
    </div>
  );
}
