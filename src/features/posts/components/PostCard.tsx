import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../types/post";
import { togglePostLike } from "../services/togglePostLike";
import { POSTS_QUERY_KEYS } from "../constants/posts-query-keys";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getRelativeTime } from "@/utils/formatDate";
import DOMPurify from "dompurify";
import { useState } from "react";

type PostCardProps = {
  post: Post;
  activeCategory?: string;
};

export function PostCard({ post, activeCategory }: PostCardProps) {
  const [isCommeting, setIsCommmeting] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: handleLike } = useMutation({
    mutationFn: async () => {
      await togglePostLike(post._id);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [POSTS_QUERY_KEYS.POSTS, activeCategory],
      });
      const prevPosts = queryClient.getQueryData([
        POSTS_QUERY_KEYS.POSTS,
        activeCategory,
      ]);
      queryClient.setQueryData(
        [POSTS_QUERY_KEYS.POSTS, activeCategory],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => {
              return {
                ...page,
                data: {
                  ...page.data,
                  posts: page.data.posts.map((p: Post) => {
                    if (p._id === post._id) {
                      return {
                        ...p,
                        isLiked: !p.isLiked,
                        likesCount: p.isLiked
                          ? p.likesCount - 1
                          : p.likesCount + 1,
                      };
                    }
                    return p;
                  }),
                },
              };
            }),
          };
        },
      );
      return { prevPosts };
    },

    onError: (err, _, context) => {
      console.log(err, "error");
      // Rollback to previous data
      if (context?.prevPosts) {
        queryClient.setQueryData(
          [POSTS_QUERY_KEYS.POSTS, activeCategory],
          context.prevPosts,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [POSTS_QUERY_KEYS.POSTS, activeCategory],
      });
    },
  });

  const onLikeClick = () => {
    handleLike();
  };
  const userInitial = post.author.username.slice(0, 2).toLocaleUpperCase();
  const cleanHtml = DOMPurify.sanitize(post.content);
  return (
    <div className="space-y-4 rounded-xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-[#252728]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10 border-2 border-white ring-2 ring-emerald-100">
            <AvatarImage src={post.author.avatar} alt={post.author.username} />
            <AvatarFallback className="bg-emerald-600 text-sm font-bold text-white">
              {userInitial}
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="text-foreground text-lg font-semibold">
              {post.author.username}
            </h3>
            <p className="text-xs text-gray-400">
              {getRelativeTime(post.createdAt)}
            </p>
          </div>
        </div>

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
        className="text-foreground max-w-none text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />

      <hr className="border-gray-100" />

      <div className="flex items-center text-sm text-gray-500 rtl:gap-4">
        <button
          onClick={onLikeClick}
          className={`mr-5 flex cursor-pointer items-center transition-colors rtl:flex-row-reverse ${
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
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <span className="text-gray-500">{post.likesCount} Like</span>
        </button>

        <div
          className="flex cursor-pointer items-center space-x-2 space-x-reverse rtl:flex-row-reverse"
          onClick={() => setIsCommmeting((prev) => !prev)}
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
        </div>
      </div>

      {/* comment box */}
      {isCommeting && (
        <div className="flex cursor-pointer items-center space-x-2 space-x-reverse">
          <Avatar className="mr-1 h-10 w-10 border-2 border-white ring-2 ring-emerald-100">
            <AvatarImage src={post.author.avatar} alt={post.author.username} />
            <AvatarFallback className="bg-emerald-600 text-sm font-bold text-white">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <input
            type="text"
            className="text-foreground flex-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            placeholder="Write a comment..."
          />
          <button className="bg-primary text-primary-foreground ml-1 cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold">
            Post
          </button>
        </div>
      )}
    </div>
  );
}
