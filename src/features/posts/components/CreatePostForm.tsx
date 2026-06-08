import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import {
	BookOpen,
	ScrollText,
	Heart,
	Users,
	Plus,
	X,
	Check,
	Send,
	Asterisk
} from "lucide-react";
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useCreatePost } from "../hooks/useCreatePost";
import { useAnalyzePost } from "../hooks/useAnalyzePost";
import { RecommendationCard } from "./RecommendationCard";
import { TipTapEditor, type TipTapEditorRef } from "./TipTapEditor";
import type { AnalyzePostResponse, ModerationInfo, Recommendation } from "../types/post";

const CATEGORIES = [
	{ value: "quran", label: "Quran", icon: BookOpen },
	{ value: "hadith", label: "Hadith", icon: ScrollText },
	{ value: "fiqh", label: "Reflection", icon: Heart }, // Re-using fiqh value for reflection for now
	{ value: "general", label: "Community", icon: Users },
] as const;

const EXTRA_TAGS = [
	{ value: "dua", label: "Dua" },
	{ value: "tafsir", label: "Tafsir" },
	{ value: "seerah", label: "Seerah" },
	{ value: "reminder", label: "Reminder" },
] as const;

type PostTag = "quran" | "hadith" | "fiqh" | "general" | "dua" | "tafsir" | "seerah" | "reminder";

export function CreatePostForm() {

	const [content, setContent] = useState("");
	const [contentLength, setContentLength] = useState(0);
	const [tags, setTags] = useState<PostTag[]>([]);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [commentsEnabled, setCommentsEnabled] = useState(true);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [showTagDropdown, setShowTagDropdown] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const editorRef = useRef<TipTapEditorRef>(null);

	const { t } = useTranslation("createPost");



	const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
	const [isRecommendationAttached, setIsRecommendationAttached] = useState(false);
	const [rejectionError, setRejectionError] = useState<{ content: string; violations: string[] } | null>(null);
	const [showSuccess, setShowSuccess] = useState(false);
	const [step, setStep] = useState<"draft" | "review">("draft");

	const { mutate: createPost, isPending: isCreating } = useCreatePost();
	const { mutate: analyzePost, isPending: isAnalyzing } = useAnalyzePost();
	const isPending = isCreating || isAnalyzing;



	function handleImageSelect(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		setImageFile(file);
		const reader = new FileReader();
		reader.onload = () => setImagePreview(reader.result as string);
		reader.readAsDataURL(file);
	}

	function removeImage() {
		setImageFile(null);
		setImagePreview(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	function resetForm() {
		setContent("");
		setContentLength(0);
		setTags([]);
		removeImage();
		setModeration(null);
		setRecommendation(null);
		setIsRecommendationAttached(false);
		setRejectionError(null);
		setShowSuccess(false);
		setStep("draft");
	}

	function handleAction(e?: FormEvent) {
		if (e) e.preventDefault();
		if (!content.trim() || isPending || tags.length === 0) return;

		setRejectionError(null);
		setShowSuccess(false);

		const formData = new FormData();
		formData.append("content", content.trim());
		formData.append("tags", JSON.stringify(tags));

		if (step === "draft") {
			// Phase 1: Analyze
			analyzePost(formData, {
				onSuccess: (data: AnalyzePostResponse) => {
					setModeration(data.data.moderation);
					setRecommendation(data.data.recommendation);
					setIsRecommendationAttached(false);
					setStep("review");
				},
				onError: (error: any) => {
					if (error.status === 422 && error.errorBody) {
						setRejectionError({
							content: error.errorBody.content || "Content does not meet guidelines",
							violations: error.errorBody.violations || [],
						});
					}
				},
			});
		} else {
			// Phase 2: Create
			formData.append("commentsEnabled", String(commentsEnabled));
			if (imageFile) formData.append("image", imageFile);
			if (isRecommendationAttached && recommendation) {
				formData.append("recommendation", JSON.stringify(recommendation));
			}

			createPost(formData, {
				onSuccess: () => {
					setShowSuccess(true);
				},
				onError: (error: any) => {
					if (error.status === 422 && error.errorBody) {
						setRejectionError({
							content: error.errorBody.content || "Content does not meet guidelines",
							violations: error.errorBody.violations || [],
						});
						setStep("draft");
					}
				},
			});
		}
	}

	const canSubmit = contentLength > 0 && !isPending && tags.length > 0;



	return (
		<div className="mx-auto max-w-3xl space-y-4 px-3 sm:px-4 md:px-0">
			{/* Error State */}
			{rejectionError && (
				<div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
					<X className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
					<div>
						<h3 className="font-semibold text-red-700 dark:text-red-300">
							{t('createPost:status.rejected')}
						</h3>
						<p className="mt-1 text-sm text-red-600 dark:text-red-400">
							{rejectionError.content}
						</p>
					</div>
				</div>
			)}

			{/* Success State */}
			{showSuccess && (
				<div className="flex items-center justify-between rounded-2xl border border-primary-200 bg-primary-50 p-4 dark:border-primary-800 dark:bg-primary-950/30">
					<div className="flex items-center gap-3">
						<Check className="h-5 w-5 text-primary-600 dark:text-primary-400" />
						<p className="font-medium text-primary-700 dark:text-primary-300">
							{t('status.success')}
						</p>
					</div>
					<Button onClick={resetForm} variant="outline" size="sm" className="h-8">
						{t('buttons.createAnother')}
					</Button>
				</div>
			)}

			{/* Main Editor Card with subtle noise texture */}
			<div className="relative z-10 w-full overflow-visible rounded-2xl border border-neutral-200/60 bg-white/90 backdrop-blur-md shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/90 transition-all duration-300">
				{/* Noise overlay */}
				<div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
				
				<form onSubmit={handleAction} className="relative z-10 flex min-h-[300px] flex-col p-4 sm:p-6 md:p-8">
					
					{/* Integrated Reflection Prompt */}
					<div className="mb-6 flex flex-col gap-1 rounded-lg bg-primary-50/50 p-4 border border-primary-100/50 dark:bg-primary-950/20 dark:border-primary-900/30">
						<h3 className="text-sm font-semibold text-primary-800 dark:text-primary-200 uppercase tracking-widest">
							{t('reflectionPrompt.title')}
						</h3>
						<p className="font-serif text-lg text-primary-900 dark:text-primary-100 italic">
							"{t('reflectionPrompt.question')}"
						</p>
					</div>

					<div className="mb-6 flex flex-nowrap sm:flex-wrap items-center gap-2 relative overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
						{CATEGORIES.map((cat) => {
							const isSelected = tags.includes(cat.value as PostTag);
							const Icon = cat.icon;
							return (
								<button
									key={cat.value}
									type="button"
									onClick={() => {
										setTags((prev) =>
											isSelected
												? prev.filter((t) => t !== cat.value)
												: [...prev, cat.value as PostTag]
										);
									}}
									className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 sm:px-4 text-xs sm:text-sm font-medium transition-colors shrink-0 whitespace-nowrap ${
										isSelected
											? "bg-primary-600 text-white shadow-sm dark:bg-primary-500"
											: "bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800/80 dark:text-neutral-400 dark:hover:bg-neutral-700"
									}`}
								>
									<Icon className="h-3.5 w-3.5 opacity-80" />
									{t(`createPost:tags.${cat.value}`)}
								</button>
							);
						})}

						{tags.filter(t => !CATEGORIES.some(c => c.value === t)).map(tag => {
							const extraCat = EXTRA_TAGS.find(e => e.value === tag);
							if (!extraCat) return null;
							return (
								<button
									key={tag}
									type="button"
									onClick={() => setTags(prev => prev.filter(t => t !== tag))}
									className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 sm:px-4 text-xs sm:text-sm font-medium transition-colors bg-primary-600 text-white shadow-sm dark:bg-primary-500 shrink-0 whitespace-nowrap"
								>
									{extraCat.label}
								</button>
							)
						})}

						<div className="relative">
							<button
								type="button"
								onClick={() => setShowTagDropdown(!showTagDropdown)}
								className="flex items-center gap-1.5 rounded-lg bg-transparent border border-dashed border-neutral-300 px-3 py-1.5 sm:px-4 text-xs sm:text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50 dark:border-neutral-700 dark:text-primary-400 dark:hover:bg-primary-950/30 shrink-0 whitespace-nowrap"
							>
								<Plus className="h-3.5 w-3.5" />
								{t('buttons.addTag' as any)}
							</button>

							{showTagDropdown && (
								<>
									<div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm sm:hidden" onClick={() => setShowTagDropdown(false)} />
									<div className="fixed left-1/2 top-1/2 z-[70] w-64 -translate-x-1/2 -translate-y-1/2 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:z-50 sm:mt-2 sm:w-48 sm:translate-x-0 sm:translate-y-0 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
										<div className="p-2 sm:p-0">
											<h3 className="mb-2 px-3 pt-2 text-xs font-semibold uppercase text-neutral-500 sm:hidden dark:text-neutral-400">
												{t('titles.selectTags' as any)}
											</h3>
											{EXTRA_TAGS.map(tag => (
												<button
													key={tag.value}
													type="button"
													className="w-full rounded-lg px-3 py-2.5 sm:py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-between transition-colors"
													onClick={() => {
														setTags(prev => prev.includes(tag.value as PostTag) ? prev.filter(t => t !== tag.value) : [...prev, tag.value as PostTag]);
														setShowTagDropdown(false);
													}}
												>
													{t(`createPost:tags.${tag.value}`)}
													{tags.includes(tag.value as PostTag) && <Check className="h-4 w-4 text-primary-600 dark:text-primary-400" />}
												</button>
											))}
										</div>
									</div>
								</>
							)}
						</div>
					</div>


					{/* Custom TipTap Editor */}
					<div className="relative mb-6">
						<TipTapEditor
							ref={editorRef}
							content={content}
							placeholder={t('placeholder')}
							onChange={(html, length) => {
								setContent(html);
								setContentLength(length);
							}}
							onImageClick={() => fileInputRef.current?.click()}
							onEmojiClick={() => setShowEmojiPicker(!showEmojiPicker)}
						/>
						
						{showEmojiPicker && (
							<div className="absolute left-0 top-full z-50 mt-2 shadow-2xl rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
								<EmojiPicker
									onEmojiClick={(emojiData) => {
										editorRef.current?.insertEmoji(emojiData.emoji);
										setShowEmojiPicker(false);
									}}
									theme={document.documentElement.classList.contains('dark') ? Theme.DARK : Theme.LIGHT}
								/>
							</div>
						)}
					</div>


					{imagePreview && (
						<div className="group relative mt-4 inline-block overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
							<img
								src={imagePreview}
								alt="Upload preview"
								className="h-32 w-auto object-cover"
							/>
							<button
								type="button"
								onClick={removeImage}
								className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					)}


					{/* Recommendation Prompt - Editorial Style */}
					{step === "review" && recommendation && !isRecommendationAttached && (
						<div className="mt-8 border-l-2 border-primary-500 bg-primary-50/30 p-4 sm:p-6 dark:border-primary-500 dark:bg-primary-950/20">
							<div className="flex flex-col sm:flex-row items-start gap-4">
								<Asterisk className="mt-1 h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
								<div className="flex-1 space-y-3">
									<h4 className="font-serif text-lg font-medium text-primary-900 dark:text-primary-100">
										{t('recommendation.suggestion')}
									</h4>
									<p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
										{t('recommendation.description', { source: t(`createPost:recommendation.${recommendation.type}`) })}
									</p>
									<div className="mt-4 rounded-lg border border-neutral-200/50 bg-white/70 p-5 dark:border-neutral-800/50 dark:bg-black/30">
										<p className="mb-3 text-right font-serif text-xl leading-relaxed text-neutral-800 dark:text-neutral-200" dir="rtl" lang="ar">
											{recommendation.arabicText}
										</p>
										<p className="text-sm leading-relaxed text-neutral-600 italic dark:text-neutral-400">
											"{recommendation.translationText}"
										</p>
									</div>
									<div className="flex items-center gap-4 pt-4">
										<button type="button" onClick={() => setIsRecommendationAttached(true)} className="text-sm font-medium text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:decoration-primary-700 dark:text-primary-400 dark:decoration-primary-700 dark:hover:decoration-primary-400">
											{t('buttons.attachReference')}
										</button>
										<button type="button" onClick={() => setRecommendation(null)} className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-300">
											{t('buttons.dismiss')}
										</button>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Attached Recommendation Card */}
					{step === "review" && recommendation && isRecommendationAttached && (
						<div className="mt-6 relative group">
							<button 
								type="button" 
								onClick={() => setIsRecommendationAttached(false)} 
								className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
								title="Remove attachment"
							>
								<X className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
							</button>
							<RecommendationCard recommendation={recommendation} />
						</div>
					)}


					<div className="mt-8 flex flex-col sm:flex-row items-center justify-between sm:justify-end border-t border-neutral-100 pt-4 dark:border-neutral-800 gap-4 sm:gap-0">

						<div className="flex flex-col-reverse sm:flex-row items-center gap-4 w-full sm:w-auto">
							
							{step === "review" && (
								<Button
									type="button"
									variant="outline"
									onClick={() => setStep("draft")}
									className="rounded-full px-6 shadow-sm w-full sm:w-auto"
								>
									{t('buttons.editPost')}
								</Button>
							)}

							
							{/* Sleek inline settings toggle */}
							<div className="flex items-center gap-2 me-2 w-full sm:w-auto justify-between sm:justify-start">
								<span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
									{t('settings.comments')}
								</span>
								<button 
									type="button" 
									onClick={() => setCommentsEnabled(!commentsEnabled)}
									className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${commentsEnabled ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-700'}`}
								>
									<span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${commentsEnabled ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'}`} />
								</button>
							</div>

							<Button
								type="submit"
								disabled={!canSubmit}
								className="rounded-xl bg-primary-600 px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-primary-500 shadow-sm w-full sm:w-auto flex justify-center"
							>
								{isAnalyzing ? (
									<>
										<Asterisk className="mr-2 h-4 w-4 animate-spin" />
										{t('buttons.reviewing')}
									</>
								) : isCreating ? (
									t('buttons.publishing')
								) : step === "draft" ? (
									t('buttons.review')
								) : (
									<>
										<Send className="mr-2 h-4 w-4" />
										{t('buttons.publishNow')}
									</>
								)}
							</Button>
						</div>
					</div>
				</form>
			</div>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp"
				onChange={handleImageSelect}
				className="hidden"
			/>
		</div>
	);
}
