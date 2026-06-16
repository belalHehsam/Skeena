import { useParams, useNavigate } from "react-router-dom";
import { useGetPostById } from "@/features/posts/hooks/useGetPostById";
import { PostCard } from "@/features/posts/components/PostCard";
import Spinner from "@/components/feedbacks/Spinner";
import ErrorMessage from "@/components/feedbacks/ErrorMessage";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useGetPostComments } from "@/features/posts/hooks/useGetPostComments";
import { CommentsSection } from "@/features/posts/components/comments/CommentsSection";
import { useTranslation } from "react-i18next";

export default function PostPage() {
  const { t } = useTranslation("common");
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
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-600 dark:text-neutral-350 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm sm:text-base font-semibold rounded-full py-1.5 px-3.5 h-auto cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
          <span>{t("actions.back")}</span>
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
