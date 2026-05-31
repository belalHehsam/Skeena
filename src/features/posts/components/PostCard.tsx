import { Heart, MessageCircle, Calendar } from "lucide-react";
import type { Post } from "../types/post";
import { RecommendationCard } from "./RecommendationCard";

type PostCardProps = {
	post: Post;
};

export function PostCard({ post }: PostCardProps) {
	const categoryStyles: Record<string, string> = {
		quran: "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300",
		hadith: "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300",
		fiqh: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
		general: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
	};

	const categoryEmojis: Record<string, string> = {
		quran: "📖",
		hadith: "📜",
		fiqh: "⚖️",
		general: "🕌",
	};

	return (
		<article className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
			{/* Header — Author + Category */}
			<div className="flex items-center justify-between p-4 pb-0">
				<div className="flex items-center gap-3">
					{post.author?.avatar ? (
						<img
							src={post.author.avatar}
							alt={post.author.username}
							className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-100 dark:ring-primary-900"
						/>
					) : (
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-heading text-sm font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
							{post.author?.username?.charAt(0).toUpperCase() ?? "?"}
						</div>
					)}
					<div>
						<p className="font-heading text-sm font-semibold text-neutral-900 dark:text-neutral-100">
							{post.author?.username ?? "Unknown"}
						</p>
						{post.createdAt && (
							<p className="flex items-center gap-1 text-xs text-neutral-400">
								<Calendar className="h-3 w-3" />
								{new Date(post.createdAt).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
								})}
							</p>
						)}
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					{post.tags?.map((tag) => (
						<span
							key={tag}
							className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
								categoryStyles[tag] ?? categoryStyles.general
							}`}
						>
							<span>{categoryEmojis[tag] ?? "🕌"}</span>
							{tag.charAt(0).toUpperCase() + tag.slice(1)}
						</span>
					))}
				</div>
			</div>

			{/* Content */}
			<div className="p-4">
				<div 
					className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1"
					dangerouslySetInnerHTML={{ __html: post.content }}
				/>
			</div>

			{/* Image (if any) */}
			{post.image && (
				<div className="px-4 pb-3">
					<img
						src={post.image}
						alt="Post image"
						className="w-full rounded-lg object-cover"
						loading="lazy"
					/>
				</div>
			)}

			{/* Recommendation (if any) */}
			{post.recommendation && (
				<div className="px-4 pb-3">
					<RecommendationCard recommendation={post.recommendation} variant="embedded" />
				</div>
			)}

			{/* Footer — Interactions */}
			<div className="flex items-center gap-6 border-t border-neutral-100 px-4 py-3 dark:border-neutral-800">
				<button className="flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400">
					<Heart className="h-4 w-4" />
					{post.likesCount ?? 0}
				</button>
				{post.commentsEnabled !== false && (
					<button className="flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-400">
						<MessageCircle className="h-4 w-4" />
						{post.commentsCount ?? 0}
					</button>
				)}
			</div>
		</article>
	);
}
