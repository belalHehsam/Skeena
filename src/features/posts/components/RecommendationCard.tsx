import { BookOpen, Quote } from "lucide-react";
import type { Recommendation } from "../types/post";

interface RecommendationCardProps {
	recommendation: Recommendation;
	variant?: "preview" | "embedded";
}

export function RecommendationCard({ recommendation, variant = "embedded" }: RecommendationCardProps) {
	const isQuran = recommendation.type === "quran";

	return (
		<div
			className={`relative overflow-hidden rounded-xl border ${
				variant === "preview"
					? "border-secondary-300 bg-secondary-50/50 dark:border-secondary-700 dark:bg-secondary-950/30"
					: "border-primary-200/50 bg-primary-50/30 dark:border-primary-800/50 dark:bg-primary-950/20"
			}`}
		>
			{/* Decorative corner accent */}
			<div className="absolute -top-6 -right-6 h-20 w-20 rotate-45 bg-secondary-400/10 dark:bg-secondary-500/10" />
			<div className="absolute -bottom-6 -left-6 h-20 w-20 rotate-45 bg-secondary-400/10 dark:bg-secondary-500/10" />

			<div className="relative p-5">
				{/* Header with type badge */}
				<div className="mb-4 flex items-center gap-2">
					<div
						className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
							isQuran
								? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
								: "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/50 dark:text-secondary-300"
						}`}
					>
						{isQuran ? (
							<BookOpen className="h-3.5 w-3.5" />
						) : (
							<Quote className="h-3.5 w-3.5" />
						)}
						{isQuran ? "Quran" : "Hadith"}
					</div>
					<span className="text-xs text-neutral-500 dark:text-neutral-400">
						{recommendation.source}
					</span>
				</div>

				{/* Arabic text */}
				{recommendation.arabicText && (
					<p
						className="mb-3 text-right font-serif text-xl leading-loose text-neutral-800 dark:text-neutral-100"
						dir="rtl"
						lang="ar"
					>
						{recommendation.arabicText}
					</p>
				)}

				{/* Divider */}
				<div className="my-3 flex items-center gap-3">
					<div className="h-px flex-1 bg-gradient-to-r from-transparent via-secondary-300/50 to-transparent dark:via-secondary-600/30" />
					<span className="text-secondary-400 dark:text-secondary-500">✦</span>
					<div className="h-px flex-1 bg-gradient-to-r from-transparent via-secondary-300/50 to-transparent dark:via-secondary-600/30" />
				</div>

				{/* Translation */}
				<p className="mb-3 text-sm leading-relaxed text-neutral-600 italic dark:text-neutral-300">
					"{recommendation.translationText}"
				</p>

				{/* Relevance explanation */}
				<p className="text-xs leading-relaxed text-neutral-400 dark:text-neutral-500">
					<span className="font-medium text-neutral-500 dark:text-neutral-400">Why this reference: </span>
					{recommendation.relevanceExplanation}
				</p>
			</div>
		</div>
	);
}
