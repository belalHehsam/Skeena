import { CommentItem } from './CommentItem';
import type { Comment } from '../../types/post';
import { useTranslation } from "react-i18next";

interface CommentsSectionProps {
  comments: Comment[];
  totalComments: number;
  currentUserAvatar?: string;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isLoadingMore?: boolean;
}

export function CommentsSection({ 
  comments, 
  totalComments,
  onLoadMore,
  hasNextPage,
  isLoadingMore,
}: CommentsSectionProps) {
  const { t } = useTranslation("common");

  return (
    <div className="bg-card border-x border-b border-neutral-200 dark:border-neutral-800 rounded-none sm:rounded-b-xl p-4 sm:p-5 shadow-sm pt-2 sm:pt-2">
      <h3 className="font-bold text-lg text-foreground mb-4">
        {t("post.commentsCount", { count: totalComments })}
      </h3>


      <div className="space-y-2">
        {comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} />
        ))}
      </div>


      {hasNextPage && (
        <button 
          onClick={onLoadMore}
          disabled={isLoadingMore}
          className="w-full border border-neutral-200 dark:border-neutral-800 text-foreground font-medium py-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isLoadingMore ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-neutral-600 dark:border-neutral-400"></div>
              <span>{t("post.loadingMore")}</span>
            </>
          ) : (
            t("post.loadMoreComments")
          )}
        </button>
      )}
    </div>
  );
}