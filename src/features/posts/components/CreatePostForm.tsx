import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import {
	Image as ImageIcon,
	Quote,
	Smile,
	BookOpen,
	ScrollText,
	Heart,
	Users,
	Plus,
	Sparkles,
	Lightbulb,
	Settings,
	X,
	Check,
} from "lucide-react";
import EmojiPicker from 'emoji-picker-react';
import { Button } from "@/components/ui/button";
import { useCreatePost } from "../hooks/useCreatePost";
import { useAnalyzePost } from "../hooks/useAnalyzePost";
import { RecommendationCard } from "./RecommendationCard";
import { TipTapEditor, type TipTapEditorRef } from "./TipTapEditor";
import type { CreatePostResponse, AnalyzePostResponse, ModerationInfo, Recommendation } from "../types/post";

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

const MAX_CONTENT_LENGTH = 500;

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


	const [moderation, setModeration] = useState<ModerationInfo | null>(null);
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

	const isOverLimit = contentLength > MAX_CONTENT_LENGTH;
	const canSubmit = contentLength > 0 && !isOverLimit && !isPending && tags.length > 0;



	return (
		<div className="mx-auto max-w-3xl space-y-4">
			{/* Error State */}
			{rejectionError && (
				<div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
					<X className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
					<div>
						<h3 className="font-semibold text-red-700 dark:text-red-300">
							Post Not Approved
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
							Post published successfully!
						</p>
					</div>
					<Button onClick={resetForm} variant="outline" size="sm" className="h-8">
						Create Another
					</Button>
				</div>
			)}

			{/* Main Editor Card */}
			<div className="overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
				<form onSubmit={handleAction} className="flex min-h-[300px] flex-col p-6">
					

					<div className="mb-6 flex flex-wrap items-center gap-2 relative">
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
									className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
										isSelected
											? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
											: "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
									}`}
								>
									<Icon className="h-3.5 w-3.5" />
									{cat.label}
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
									className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
								>
									{extraCat.label}
								</button>
							)
						})}

						<div className="relative">
							<button
								type="button"
								onClick={() => setShowTagDropdown(!showTagDropdown)}
								className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
							>
								<Plus className="h-3.5 w-3.5" />
								Add Tag
							</button>

							{showTagDropdown && (
								<div className="absolute top-full left-0 mt-2 w-48 rounded-xl border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800 z-10">
									{EXTRA_TAGS.map(tag => (
										<button
											key={tag.value}
											type="button"
											className="w-full rounded-lg px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-between"
											onClick={() => {
												setTags(prev => prev.includes(tag.value as PostTag) ? prev.filter(t => t !== tag.value) : [...prev, tag.value as PostTag]);
												setShowTagDropdown(false);
											}}
										>
											{tag.label}
											{tags.includes(tag.value as PostTag) && <Check className="h-4 w-4" />}
										</button>
									))}
								</div>
							)}
						</div>
					</div>


					<div className="flex-1">
						<TipTapEditor 
							ref={editorRef}
							content={content} 
							onChange={(html, length) => {
								setContent(html);
								setContentLength(length);
							}} 
							isOverLimit={isOverLimit} 
						/>
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


					{/* Recommendation Prompt */}
					{step === "review" && recommendation && !isRecommendationAttached && (
						<div className="mt-6 flex items-start gap-4 rounded-2xl bg-[#F4FCF7] p-5 dark:bg-primary-950/20">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E6F4EA] dark:bg-primary-900/40">
								<Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400" />
							</div>
							<div className="flex-1 space-y-2">
								<h4 className="font-medium text-primary-800 dark:text-primary-300">
									AI Suggestion
								</h4>
								<p className="text-sm text-neutral-600 dark:text-neutral-400">
									We found a relevant {recommendation.type === "quran" ? "Quranic Ayah" : "Hadith"} for your post. Would you like to attach it?
								</p>
								<div className="mt-2 rounded-xl bg-white p-4 shadow-sm dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800">
									<p className="mb-2 text-right font-serif text-lg leading-relaxed text-neutral-800 dark:text-neutral-200" dir="rtl" lang="ar">
										{recommendation.arabicText}
									</p>
									<p className="text-sm text-neutral-600 italic dark:text-neutral-400">
										"{recommendation.translationText}"
									</p>
								</div>
								<div className="flex items-center gap-4 pt-3">
									<button type="button" onClick={() => setIsRecommendationAttached(true)} className="rounded-full bg-primary-700 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-800">
										Attach to Post
									</button>
									<button type="button" onClick={() => setRecommendation(null)} className="text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
										Dismiss
									</button>
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


					<div className="mt-8 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
						<div className="flex items-center gap-4 relative">
							<button 
								type="button" 
								onClick={() => fileInputRef.current?.click()}
								className="text-neutral-400 transition-colors hover:text-primary-600 dark:text-neutral-500 dark:hover:text-primary-400"
							>
								<ImageIcon className="h-5 w-5" />
							</button>
							<button type="button" onClick={() => editorRef.current?.toggleQuote()} className="text-neutral-400 transition-colors hover:text-primary-600 dark:text-neutral-500 dark:hover:text-primary-400">
								<Quote className="h-5 w-5" />
							</button>
							<div className="relative">
								<button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-neutral-400 transition-colors hover:text-primary-600 dark:text-neutral-500 dark:hover:text-primary-400">
									<Smile className="h-5 w-5" />
								</button>
								{showEmojiPicker && (
									<div className="absolute bottom-full left-0 mb-2 z-20 shadow-xl rounded-xl">
										<EmojiPicker 
											onEmojiClick={(emojiData) => {
												editorRef.current?.insertEmoji(emojiData.emoji);
												setShowEmojiPicker(false);
											}}
										/>
									</div>
								)}
							</div>
						</div>

						<div className="flex items-center gap-4">
							<span className={`text-sm font-medium ${isOverLimit ? "text-red-500" : "text-neutral-400 dark:text-neutral-500"}`}>
								{contentLength} / {MAX_CONTENT_LENGTH}
							</span>
							
							{step === "review" && (
								<Button
									type="button"
									variant="outline"
									onClick={() => setStep("draft")}
									className="rounded-full px-6 shadow-sm"
								>
									Edit Post
								</Button>
							)}

							<Button
								type="submit"
								disabled={!canSubmit}
								className="rounded-full bg-primary-600 px-6 font-semibold text-white shadow-sm hover:bg-primary-700"
							>
								{isAnalyzing ? "Analyzing..." : isCreating ? "Publishing..." : step === "draft" ? "Review & Get Suggestions" : "Publish Post"}
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

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div className="flex flex-col rounded-3xl bg-[#FBF9F4] p-6 dark:bg-[#2C2A25]">
					<div className="mb-3 flex items-center gap-2">
						<Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
						<h3 className="font-heading font-medium text-neutral-900 dark:text-neutral-100">
							Reflection Prompt
						</h3>
					</div>
					<p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
						"What was one small moment of Sakina (peace) you experienced today?"
					</p>
				</div>

				<div className="flex flex-col justify-between rounded-3xl bg-[#F6F7F6] p-6 dark:bg-[#262826]">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="font-heading font-medium text-neutral-900 dark:text-neutral-100">
							Post Settings
						</h3>
						<Settings className="h-5 w-5 text-neutral-500" />
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-neutral-600 dark:text-neutral-400">
							Comments enabled
						</span>
						<button 
							type="button" 
							onClick={() => setCommentsEnabled(!commentsEnabled)}
							className={`relative h-6 w-11 rounded-full transition-colors ${commentsEnabled ? "bg-primary-600" : "bg-neutral-300 dark:bg-neutral-600"}`}
						>
							<div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${commentsEnabled ? "left-[26px]" : "left-1"}`} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
