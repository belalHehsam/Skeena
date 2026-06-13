import {
  useState,
  useRef,
  type ChangeEvent,
  type FormEvent,
  useEffect,
} from "react";
import {
  BookOpen,
  ScrollText,
  Heart,
  Users,
  Plus,
  X,
  Check,
  Send,
  Asterisk,
} from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useCreatePost } from "../hooks/useCreatePost";
import { useAnalyzePost } from "../hooks/useAnalyzePost";
import { RecommendationCard } from "./RecommendationCard";
import { TipTapEditor, type TipTapEditorRef } from "./TipTapEditor";
import type { AnalyzePostResponse, Recommendation } from "../types/post";

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

type PostTag =
  | "quran"
  | "hadith"
  | "fiqh"
  | "general"
  | "dua"
  | "tafsir"
  | "seerah"
  | "reminder";

export function CreatePostForm({ post }) {
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

  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );
  const [isRecommendationAttached, setIsRecommendationAttached] =
    useState(false);
  const [rejectionError, setRejectionError] = useState<{
    content: string;
    violations: string[];
  } | null>(null);
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
      analyzePost(formData, {
        onSuccess: (data: AnalyzePostResponse) => {
          setRecommendation(data.data.recommendation);
          setIsRecommendationAttached(false);
          setStep("review");
        },
        onError: (error: any) => {
          if (error.status === 422 && error.errorBody) {
            setRejectionError({
              content:
                error.errorBody.content || "Content does not meet guidelines",
              violations: error.errorBody.violations || [],
            });
          }
        },
      });
    } else {
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
              content:
                error.errorBody.content || "Content does not meet guidelines",
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
      {rejectionError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
          <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
          <div>
            <h3 className="font-semibold text-red-700 dark:text-red-300">
              {t("status.rejected")}
            </h3>
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {rejectionError.content}
            </p>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-950/30 flex items-center justify-between rounded-2xl border p-4">
          <div className="flex items-center gap-3">
            <Check className="text-primary-600 dark:text-primary-400 h-5 w-5" />
            <p className="text-primary-700 dark:text-primary-300 font-medium">
              {t("status.success")}
            </p>
          </div>
          <Button
            onClick={resetForm}
            variant="outline"
            size="sm"
            className="h-8"
          >
            {t("buttons.createAnother")}
          </Button>
        </div>
      )}

      <div className="relative z-10 w-full overflow-visible rounded-2xl border border-neutral-200/60 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-neutral-800/60 dark:bg-neutral-900/90">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        />

        <form
          onSubmit={handleAction}
          className="relative z-10 flex min-h-[300px] flex-col p-4 sm:p-6 md:p-8"
        >
          <div className="bg-primary-50/50 border-primary-100/50 dark:bg-primary-950/20 dark:border-primary-900/30 mb-6 flex flex-col gap-1 rounded-lg border p-4">
            <h3 className="text-primary-800 dark:text-primary-200 text-sm font-semibold tracking-widest uppercase">
              {t("reflectionPrompt.title")}
            </h3>
            <p className="text-primary-900 dark:text-primary-100 font-serif text-lg italic">
              "{t("reflectionPrompt.question")}"
            </p>
          </div>

          <div className="relative -mx-4 mb-6 flex [scrollbar-width:none] flex-nowrap items-center gap-2 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
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
                        : [...prev, cat.value as PostTag],
                    );
                  }}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors sm:px-4 sm:text-sm ${
                    isSelected
                      ? "bg-primary-600 dark:bg-primary-500 text-white shadow-sm"
                      : "bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800/80 dark:text-neutral-400 dark:hover:bg-neutral-700"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 opacity-80" />
                  {t(`tags.${cat.value}`)}
                </button>
              );
            })}

            {tags
              .filter((t) => !CATEGORIES.some((c) => c.value === t))
              .map((tag) => {
                const extraCat = EXTRA_TAGS.find((e) => e.value === tag);
                if (!extraCat) return null;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setTags((prev) => prev.filter((t) => t !== tag))
                    }
                    className="bg-primary-600 dark:bg-primary-500 flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white shadow-sm transition-colors sm:px-4 sm:text-sm"
                  >
                    {extraCat.label}
                  </button>
                );
              })}

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTagDropdown(!showTagDropdown)}
                className="text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950/30 flex shrink-0 items-center gap-1.5 rounded-lg border border-dashed border-neutral-300 bg-transparent px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors sm:px-4 sm:text-sm dark:border-neutral-700"
              >
                <Plus className="h-3.5 w-3.5" />
                {t("buttons.addTag" as any)}
              </button>

              {showTagDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm sm:hidden"
                    onClick={() => setShowTagDropdown(false)}
                  />
                  <div className="fixed top-1/2 left-1/2 z-[70] w-64 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl sm:absolute sm:top-full sm:right-0 sm:left-auto sm:z-50 sm:mt-2 sm:w-48 sm:translate-x-0 sm:translate-y-0 dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="p-2 sm:p-0">
                      <h3 className="mb-2 px-3 pt-2 text-xs font-semibold text-neutral-500 uppercase sm:hidden dark:text-neutral-400">
                        {t("titles.selectTags" as any)}
                      </h3>
                      {EXTRA_TAGS.map((tag) => (
                        <button
                          key={tag.value}
                          type="button"
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-100 sm:py-2 dark:text-neutral-200 dark:hover:bg-neutral-700"
                          onClick={() => {
                            setTags((prev) =>
                              prev.includes(tag.value as PostTag)
                                ? prev.filter((t) => t !== tag.value)
                                : [...prev, tag.value as PostTag],
                            );
                            setShowTagDropdown(false);
                          }}
                        >
                          {t(`tags.${tag.value}`)}
                          {tags.includes(tag.value as PostTag) && (
                            <Check className="text-primary-600 dark:text-primary-400 h-4 w-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="relative mb-6">
            <TipTapEditor
              ref={editorRef}
              content={content}
              placeholder={t("placeholder")}
              onChange={(html, length) => {
                setContent(html);
                setContentLength(length);
              }}
              onImageClick={() => fileInputRef.current?.click()}
              onEmojiClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />

            {showEmojiPicker && (
              <div className="absolute top-full left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-neutral-200 shadow-2xl dark:border-neutral-800">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    editorRef.current?.insertEmoji(emojiData.emoji);
                    setShowEmojiPicker(false);
                  }}
                  theme={
                    document.documentElement.classList.contains("dark")
                      ? Theme.DARK
                      : Theme.LIGHT
                  }
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
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === "review" && recommendation && !isRecommendationAttached && (
            <div className="border-primary-500 bg-primary-50/30 dark:border-primary-500 dark:bg-primary-950/20 mt-8 border-l-2 p-4 sm:p-6">
              <div className="flex flex-col items-start gap-4 sm:flex-row">
                <Asterisk className="text-primary-600 dark:text-primary-400 mt-1 h-5 w-5 shrink-0" />
                <div className="flex-1 space-y-3">
                  <h4 className="text-primary-900 dark:text-primary-100 font-serif text-lg font-medium">
                    {t("recommendation.suggestion")}
                  </h4>
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {t("recommendation.description", {
                      source: t(`recommendation.${recommendation.type}`),
                    })}
                  </p>
                  <div className="mt-4 rounded-lg border border-neutral-200/50 bg-white/70 p-5 dark:border-neutral-800/50 dark:bg-black/30">
                    <p
                      className="mb-3 text-right font-serif text-xl leading-relaxed text-neutral-800 dark:text-neutral-200"
                      dir="rtl"
                      lang="ar"
                    >
                      {recommendation.arabicText}
                    </p>
                    <p className="text-sm leading-relaxed text-neutral-600 italic dark:text-neutral-400">
                      "{recommendation.translationText}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsRecommendationAttached(true)}
                      className="text-primary-700 decoration-primary-300 hover:decoration-primary-700 dark:text-primary-400 dark:decoration-primary-700 dark:hover:decoration-primary-400 text-sm font-medium underline underline-offset-4 transition-colors"
                    >
                      {t("buttons.attachReference")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecommendation(null)}
                      className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-300"
                    >
                      {t("buttons.dismiss")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "review" && recommendation && isRecommendationAttached && (
            <div className="group relative mt-6">
              <button
                type="button"
                onClick={() => setIsRecommendationAttached(false)}
                className="absolute top-4 right-4 z-10 rounded-full bg-black/5 p-1.5 opacity-0 transition-colors group-hover:opacity-100 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
                title="Remove attachment"
              >
                <X className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              </button>
              <RecommendationCard recommendation={recommendation} />
            </div>
          )}

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-4 sm:flex-row sm:justify-end sm:gap-0 dark:border-neutral-800">
            <div className="flex w-full flex-col-reverse items-center gap-4 sm:w-auto sm:flex-row">
              {step === "review" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("draft")}
                  className="w-full rounded-full px-6 shadow-sm sm:w-auto"
                >
                  {t("buttons.editPost")}
                </Button>
              )}

              <div className="me-2 flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  {t("settings.comments")}
                </span>
                <button
                  type="button"
                  onClick={() => setCommentsEnabled(!commentsEnabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${commentsEnabled ? "bg-primary-500" : "bg-neutral-200 dark:bg-neutral-700"}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${commentsEnabled ? "translate-x-4 rtl:-translate-x-4" : "translate-x-0"}`}
                  />
                </button>
              </div>

              <Button
                type="submit"
                disabled={!canSubmit}
                className="bg-primary-600 dark:bg-primary-500 flex w-full justify-center rounded-xl px-8 py-4 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 sm:w-auto"
              >
                {isAnalyzing ? (
                  <>
                    <Asterisk className="mr-2 h-4 w-4 animate-spin" />
                    {t("buttons.reviewing")}
                  </>
                ) : isCreating ? (
                  t("buttons.publishing")
                ) : step === "draft" ? (
                  t("buttons.review")
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t("buttons.publishNow")}
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
