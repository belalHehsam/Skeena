import type { Post } from "../types/post";
import { FaRegComment, FaRegBookmark } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTogglePostLike } from "../hooks/useTogglePostLike";
import { useTranslation } from "react-i18next";

interface PostDetailsProps {
  post: Post;
}

export function PostDetails({ post }: PostDetailsProps) {
  const { t } = useTranslation("common");

  const { mutate: toggleLike } = useTogglePostLike();

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={post.author.avatar} alt={post.author.username} />
            <AvatarFallback className="bg-emerald-600 text-sm font-bold text-white">
              {post.author.username.slice(0, 2).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-gray-900">{post.author.username}</h3>
            <span className="text-sm text-gray-500">{formattedDate}</span>
          </div>
        </div>
      </div>

      {post.image && (
        <img
          src={post.image}
          alt="Post highlight"
          className="h-auto w-full rounded-xl object-cover"
        />
      )}

      {post.recommendation && (
        <blockquote className="my-2 rounded-r-lg border-l-4 border-green-700 bg-green-50/50 py-3 pr-3 pl-4">
          <p className="text-lg font-medium text-green-800 italic">
            "
            {post.recommendation.translationText ||
              post.recommendation.arabicText}
            "
          </p>
          <footer className="mt-2 text-sm font-semibold tracking-wider text-gray-500 uppercase">
            — {post.recommendation.source} {post.recommendation.reference}
          </footer>
        </blockquote>
      )}

      <div
        className="prose prose-green max-w-none space-y-4 leading-relaxed text-gray-700"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags && post.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gray-100 bg-gray-50 px-4 py-1.5 text-sm text-gray-600 capitalize"
            >
              #{t("categories." + tag, { defaultValue: tag })}
            </span>
          ))}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex gap-6">
          <button
            onClick={() => toggleLike(post._id)}
            className={`flex items-center gap-2 transition-colors ${post.isLiked ? "font-semibold text-red-500" : "text-gray-500 hover:text-red-500"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={post.isLiked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            <span className="font-medium">
              {Math.max(0, post.likesCount)} Like
            </span>
          </button>

          <button className="flex items-center gap-2 text-gray-500 transition-colors hover:text-green-700">
            <FaRegComment size={22} />

            <span className="font-medium">{post.commentsCount}</span>
          </button>

          <button className="flex items-center gap-2 text-gray-500 transition-colors hover:text-green-700">
            <IoShareSocialOutline size={23} />
          </button>
        </div>

        <button className="text-gray-500 transition-colors hover:text-green-700">
          <FaRegBookmark size={22} />
        </button>
      </div>
    </div>
  );
}
