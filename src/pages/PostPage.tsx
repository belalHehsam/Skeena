import { useParams, useNavigate } from "react-router-dom";
import { useGetPostById } from "@/features/posts/hooks/useGetPostById";
import { PostCard } from "@/features/posts/components/PostCard";
import Spinner from "@/components/feedbacks/Spinner";
import ErrorMessage from "@/components/feedbacks/ErrorMessage";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useGetPostComments } from "@/features/posts/hooks/useGetPostComments";
import { CommentsSection } from "@/features/posts/components/comments/CommentsSection";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetPostById(id);

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetPostComments(id || '');

  if (isLoading || isCommentsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !data?.data?.post) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <ErrorMessage onRetry={refetch} />
      </div>
    );
  }

  const post = data.data.post;
  const comments = commentsData?.pages.flatMap(page => page.data.comments) || [];
  const totalComments = commentsData?.pages[0]?.data.pagination.total || post.commentsCount; 

  return (
    <div className="mx-auto max-w-5xl sm:px-4 py-6 space-y-4">
      <div className="flex items-center px-4 sm:px-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>

      <div className="flex flex-col">
        <PostCard post={post} isSinglePost />

        <CommentsSection 
          comments={comments} 
          totalComments={totalComments}
          onLoadMore={fetchNextPage}
          hasNextPage={!!hasNextPage}
          isLoadingMore={isFetchingNextPage}
        />
      </div>
    </div>
  );
}
