import type { Post } from "../types/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getRelativeTime } from "@/utils/formatDate";
import DOMPurify from "dompurify";
import { useState } from "react";
import useToggleLike from "../hooks/useToggleLike";
import PostAction from "./PostAction";
import { RecommendationCard } from "./RecommendationCard";
import { useCreateComment } from "../hooks/useCreateComment";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { QueryKey } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { getAvatarColorClass } from "@/components/shared/UserAvatar";

type PostCardProps = {
  post: Post;
  activeCategory?: string;
  cacheQueryKey?: QueryKey;
  isSinglePost?: boolean;
};

export function PostCard({
  post,
  activeCategory,
  cacheQueryKey,
  isSinglePost,
}: PostCardProps) {
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const { mutate: addComment, isPending: isCommentingPending } =
    useCreateComment(post._id);

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    addComment(commentText, {
      onSuccess: () => {
        setCommentText("");
      },
    });
  };

  const { mutate: handleLike } = useToggleLike(
    post,
    activeCategory,
    cacheQueryKey,
  );

  const onLikeClick = () => {
    handleLike();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isSinglePost) return;
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, svg, [role="button"]')) {
      return;
    }
    navigate(`/posts/${post._id}`);
  };

  const userInitial = post.author.username.slice(0, 2).toLocaleUpperCase();
  const cleanHtml = DOMPurify.sanitize(post.content);
  return (
    <div
      onClick={handleCardClick}
      className={`bg-card relative space-y-4 border-neutral-200 p-4 shadow-sm sm:p-5 dark:border-neutral-800 ${
        !isSinglePost ? "cursor-pointer" : ""
      } ${
        isSinglePost
          ? "rounded-none border-x border-t sm:rounded-t-xl"
          : "rounded-none border-y sm:rounded-xl sm:border-x"
      }`}
    >
      <PostAction post={post} activeCategory={activeCategory as string} />

      <div className="mt-2.5 flex items-center justify-between">
        <Link
          to={`/profile/${post.author._id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
        >
          <Avatar className="ring-primary-100 h-10 w-10 border-2 border-white ring-2">
            <AvatarImage src={post.author.avatar} alt={post.author.username} />
            <AvatarFallback
              className={`text-sm font-bold ${getAvatarColorClass(post.author.username)}`}
            >
              {userInitial}
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="text-foreground text-lg font-semibold hover:underline">
              {post.author.username}
            </h3>
            <p className="text-xs text-gray-400">
              {getRelativeTime(post.createdAt, i18n.language)}
            </p>
          </div>
        </Link>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-semibold"
              >
                #{t("categories." + tag, { defaultValue: tag })}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        dir="auto"
        className="text-foreground max-w-none text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />

      {post.image && (
        <div onClick={(e) => e.stopPropagation()}>
          <Dialog>
            <DialogTrigger
              render={
                <button
                  type="button"
                  title="View image"
                  aria-label="View image"
                  className="block w-full cursor-pointer overflow-hidden rounded-xl border border-neutral-100 text-left dark:border-neutral-800"
                />
              }
            >
              <img
                src={post.image}
                alt="Post image"
                className="max-h-75 w-full object-cover sm:max-h-125"
                loading="lazy"
              />
            </DialogTrigger>
            <DialogContent
              className="w-fit max-w-[95vw] border-none bg-transparent p-0 shadow-none outline-none sm:max-w-[95vw]"
              showCloseButton={false}
            >
              <DialogTitle className="sr-only">Image Preview</DialogTitle>
              <div className="flex items-center justify-center">
                <img
                  src={post.image}
                  alt="Full size"
                  className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain shadow-2xl"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {post.recommendation && (
        <div className="mt-3">
          <RecommendationCard recommendation={post.recommendation} />
        </div>
      )}

      <hr className="border-gray-100" />

      <div className="flex items-center gap-3 text-sm text-gray-500">
        <button
          type="button"
          onClick={onLikeClick}
          title={post.isLiked ? t("post.unlike") : t("post.like")}
          aria-label={post.isLiked ? t("post.unlike") : t("post.like")}
          className={`flex cursor-pointer items-center gap-1 transition-colors ${
            post.isLiked
              ? "font-semibold text-red-500"
              : "text-gray-500 hover:text-red-500"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={post.isLiked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="m-0 h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <span className="font-medium">
            {t("post.likesCount", { count: Math.max(0, post.likesCount) })}
          </span>
        </button>

        <Link
          to={`/posts/${post._id}`}
          className="flex cursor-pointer items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="m-0 h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-1.923 2.413a4.474 4.474 0 0 0 3.103-.12c.614-.246 1.2-.428 1.664-.135A9.757 9.757 0 0 0 12 20.25Z"
            />
          </svg>
          <span className="ArabicDigits">
            {t("post.commentsCount", { count: post.commentsCount })}
          </span>
        </Link>
      </div>

      {/* comment box */}
      {post.commentsEnabled && (
        <div className="mt-2 flex items-center gap-1.5 sm:gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
          <Avatar className="ring-primary-100 h-8 w-8 sm:h-10 sm:w-10 border border-white ring-1 sm:ring-2 sm:border-2">
            <AvatarImage src={user?.avatar} alt={user?.username} />
            <AvatarFallback
              className={`text-xs sm:text-sm font-bold ${getAvatarColorClass(user?.username || "")}`}
            >
              {user?.username?.slice(0, 2).toLocaleUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={isCommentingPending}
            onKeyDown={(e) => {
              if (e.key === "Enter") handlePostComment();
            }}
            className="text-foreground m-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 sm:px-4 sm:py-3 text-sm placeholder:text-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:placeholder:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
            placeholder={t("post.writeComment")}
          />
          <Button
            type="button"
            onClick={handlePostComment}
            disabled={isCommentingPending || !commentText.trim()}
            className="rounded-lg text-sm font-semibold px-4 sm:px-8 border-0 self-stretch h-auto"
          >
            {isCommentingPending ? t("post.posting") : t("post.postBtn")}
          </Button>
        </div>
      )}
    </div>
  );
}
