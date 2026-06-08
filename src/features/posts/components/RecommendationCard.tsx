import { BookOpen, ScrollText } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Recommendation } from "../types/post";

interface RecommendationCardProps {
	recommendation: Recommendation;
	variant?: "preview" | "embedded";
}

export function RecommendationCard({ recommendation, variant = "embedded" }: RecommendationCardProps) {
	const isQuran = recommendation.type === "quran";
	const { t } = useTranslation("createPost");

	return (
		<div
			className={`relative overflow-hidden border-l-4 rounded-r-md transition-all duration-300 ${
				variant === "preview"
					? "border-secondary-500 bg-secondary-50/50 dark:border-secondary-400 dark:bg-secondary-950/30"
					: "border-primary-600 bg-primary-50/30 dark:border-primary-500 dark:bg-primary-950/20"
			}`}
		>
			<div className="relative p-6 sm:p-8">
				{/* Header with type badge */}
				<div className="mb-4 flex items-center gap-2">
					<div
						className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold tracking-widest uppercase ${
							isQuran
								? "bg-primary-600 text-white dark:bg-primary-500"
								: "bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200"
						}`}
					>
						{isQuran ? <BookOpen className="h-3 w-3" /> : <ScrollText className="h-3 w-3" />}
						<span>{isQuran ? t('recommendationCard.quran' as any) : t('recommendationCard.hadith' as any)}</span>
					</div>
					<span className="text-xs text-neutral-500 dark:text-neutral-400">
						{recommendation.source}
					</span>
				</div>

				{/* Arabic text */}
				{recommendation.arabicText && (
					<p
						className="mb-4 text-right font-serif text-2xl leading-relaxed text-neutral-800 drop-shadow-sm dark:text-neutral-100"
						dir="rtl"
						lang="ar"
					>
						{recommendation.arabicText}
					</p>
				)}

				{/* Divider */}
				<div className="my-5 flex items-center justify-center">
					<div className="h-px w-16 bg-neutral-300 dark:bg-neutral-700" />
				</div>

				{/* Translation */}
				<p className="mb-4 text-base leading-relaxed text-neutral-600 italic dark:text-neutral-400 font-medium font-serif">
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
