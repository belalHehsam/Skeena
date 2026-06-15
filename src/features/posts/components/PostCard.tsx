import type { Post } from "../types/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const { mutate: addComment, isPending: isCommentingPending } = useCreateComment(post._id);

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
      className={`bg-card relative space-y-4 border-emerald-100 p-4 sm:p-5 shadow-sm dark:border-emerald-900 ${
        !isSinglePost ? "cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors" : ""
      } ${
      isSinglePost 
        ? "rounded-none sm:rounded-t-xl border-x border-t" 
        : "rounded-none sm:rounded-xl border-y sm:border-x"
    }`}>
      <PostAction post={post} activeCategory={activeCategory as string} />

      <div className="mt-2.5 flex items-center justify-between">
        <Link 
          to={`/profile/${post.author._id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Avatar className="h-10 w-10 border-2 border-white ring-2 ring-emerald-100">
            <AvatarImage src={post.author.avatar} alt={post.author.username} />
            <AvatarFallback className="bg-emerald-600 text-sm font-bold text-white">
              {userInitial}
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="text-foreground text-lg font-semibold hover:underline">
              {post.author.username}
            </h3>
            <p className="text-xs text-gray-400">
              {getRelativeTime(post.createdAt)}
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
                #{tag.toUpperCase()}
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
                <button type="button" className="block w-full overflow-hidden rounded-xl border border-neutral-100 dark:border-neutral-800 cursor-pointer text-left" />
              }
            >
              <img
                src={post.image}
                alt="Post image"
                className="w-full max-h-[300px] sm:max-h-[500px] object-cover"
                loading="lazy"
              />
            </DialogTrigger>
            <DialogContent 
              className="w-fit max-w-[95vw] sm:max-w-[95vw] bg-transparent border-none shadow-none p-0 outline-none" 
              showCloseButton={false}
            >
              <DialogTitle className="sr-only">Image Preview</DialogTitle>
              <div className="flex items-center justify-center">
                <img
                  src={post.image}
                  alt="Full size"
                  className="max-h-[90vh] max-w-[95vw] object-contain rounded-lg shadow-2xl"
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

      <div className="flex items-center text-sm text-gray-500 rtl:gap-4">
        <button
          onClick={onLikeClick}
          className={`mr-5 flex cursor-pointer items-center transition-colors rtl:flex-row-reverse ${post.isLiked
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
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <span className="font-medium">{Math.max(0, post.likesCount)} Like</span>
        </button>

        <Link
          to={`/posts/${post._id}`}
          className="flex cursor-pointer items-center space-x-2 space-x-reverse rtl:flex-row-reverse"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-1.923 2.413a4.474 4.474 0 0 0 3.103-.12c.614-.246 1.2-.428 1.664-.135A9.757 9.757 0 0 0 12 20.25Z"
            />
          </svg>
          <span className="ArabicDigits">{post.commentsCount} comment</span>
        </Link>
      </div>

      {/* comment box */}
      {post.commentsEnabled && (
        <div className="flex items-center space-x-2 space-x-reverse border-t border-emerald-100 dark:border-emerald-900 pt-4 mt-2">
          <Avatar className="mr-1 h-10 w-10 border-2 border-white ring-2 ring-emerald-100">
            <AvatarImage src={user?.avatar} alt={user?.username} />
            <AvatarFallback className="bg-emerald-600 text-sm font-bold text-white">
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
            className="text-foreground flex-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            placeholder="Write a comment..."
          />
          <button
            onClick={handlePostComment}
            disabled={isCommentingPending || !commentText.trim()}
            className="bg-primary text-primary-foreground ml-1 cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            {isCommentingPending ? "Posting..." : "Post"}
          </button>
        </div>
      )}
    </div>
  );
}
