import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { useCreatePost } from "./useCreatePost";
import { useAnalyzePost } from "./useAnalyzePost";
import type { AnalyzePostResponse, Recommendation } from "../types/post";
import type { TipTapEditorRef } from "../components/TipTapEditor";
import { useUpdatePost } from "./useUpdatePost";
import type { Post } from "../types/post";
import { toast } from "sonner";
import i18n from "@/i18n";

export type PostTag = "quran" | "hadith" | "fiqh" | "general" | "dua" | "tafsir" | "seerah" | "reminder";

export function usePostForm(initialData?: Post | null) {
  const [content, setContent] = useState(initialData?.content || "");
  const [contentLength, setContentLength] = useState(initialData?.content?.length || 0);
  const [tags, setTags] = useState<PostTag[]>((initialData?.tags as PostTag[]) || []);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [commentsEnabled, setCommentsEnabled] = useState(initialData?.commentsEnabled ?? true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<TipTapEditorRef>(null);

  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isRecommendationAttached, setIsRecommendationAttached] = useState(false);
  const [rejectionError, setRejectionError] = useState<{ content: string; violations: string[] } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState<"draft" | "review">("draft");
  // Stored from /analyze response so publish doesn't re-run AI
  const [moderationStatus, setModerationStatus] = useState<"approved" | "needs_review">("approved");
  const [isFlagged, setIsFlagged] = useState(false);

  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();
  const { mutate: analyzePost, isPending: isAnalyzing } = useAnalyzePost();
  const isPending = isCreating || isUpdating || isAnalyzing;

  function handleImageSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setRejectionError({
        content: "The selected image is too large. Maximum allowed size is 10MB.",
        violations: ["file_too_large"]
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setRejectionError(null);

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
    setRecommendation(initialData?.recommendation || null);
    setIsRecommendationAttached(!!initialData?.recommendation);
    setRejectionError(null);
    setShowSuccess(false);
    setStep("draft");
  }

  function submitForAnalysis(formData: FormData) {
    if (imageFile) formData.append("image", imageFile);
    analyzePost(formData, {
      onSuccess: (data: AnalyzePostResponse) => {
        setRecommendation(data.data.recommendation);
        setModerationStatus(data.data.moderation.status);
        setIsFlagged(data.data.moderation.status === "needs_review");
        setIsRecommendationAttached(false);
        setStep("review");
        
        if (data.data.moderation.status === "approved") {
          toast.success(i18n.t("errors:posts.reviewedApproved"));
        } else if (data.data.moderation.status === "needs_review") {
          toast.warning(i18n.t("errors:posts.flaggedReview"));
        }
      },
      onError: (error: any) => {
        if (error.status === 422 && error.errorBody && !Array.isArray(error.errorBody)) {
          // Moderation rejection — show the rejection banner
          setRejectionError({
            content: error.errorBody.content || "Content does not meet guidelines",
            violations: error.errorBody.violations || [],
          });
        } else if (error.status === 422 && Array.isArray(error.errorBody)) {
          // Zod validation error — show as toast with field details
          const firstIssue = error.errorBody[0];
          toast.error(`Validation error: ${firstIssue?.message || "Invalid input"}`);
        } else {
          toast.error(error.message || "Something went wrong while analyzing the post.");
        }
      },
    });
  }

  function submitFinalPost(formData: FormData) {
    formData.append("commentsEnabled", String(commentsEnabled));
    // moderationStatus and isFlagged are only needed for new posts (createPost reads them
    // from req.body to avoid re-running AI). updatePost manages its own moderation state.
    if (!initialData?._id) {
      formData.append("moderationStatus", moderationStatus);
      formData.append("isFlagged", String(isFlagged));
    }
    if (imageFile) formData.append("image", imageFile);
    if (isRecommendationAttached && recommendation) {
      formData.append("recommendation", JSON.stringify(recommendation));
    }

    const mutateOptions = {
      onSuccess: () => {
        setShowSuccess(true);
      },
      onError: (error: any) => {
        if (error.status === 422 && error.errorBody && !Array.isArray(error.errorBody)) {
          // Moderation rejection — show the rejection banner
          setRejectionError({
            content: error.errorBody.content || "Content does not meet guidelines",
            violations: error.errorBody.violations || [],
          });
          setStep("draft");
        } else if (error.status === 422 && Array.isArray(error.errorBody)) {
          // Zod validation error — show as toast with field details
          const firstIssue = error.errorBody[0];
          toast.error(`Validation error: ${firstIssue?.message || "Invalid input"}`);
        } else {
          toast.error(error.message || "Something went wrong while saving the post.");
        }
      },
    };

    if (initialData?._id) {
      updatePost({ postId: initialData._id, formData }, mutateOptions);
    } else {
      createPost(formData, mutateOptions);
    }
  }

  function handleAction(e?: FormEvent) {
    if (e) e.preventDefault();
    if (isPending) return;

    if (!content.trim() || contentLength === 0) {
      toast.error(i18n.t("errors:posts.emptyContent"));
      return;
    }

    if (tags.length === 0) {
      toast.error(i18n.t("errors:posts.selectTag"));
      return;
    }

    setRejectionError(null);
    setShowSuccess(false);

    const formData = new FormData();
    formData.append("content", content.trim());
    formData.append("tags", JSON.stringify(tags));

    if (step === "draft") {
      submitForAnalysis(formData);
    } else {
      submitFinalPost(formData);
    }
  }

  const canSubmit = !isPending;

  return {
    content, setContent,
    contentLength, setContentLength,
    tags, setTags,
    imagePreview,
    commentsEnabled, setCommentsEnabled,
    showEmojiPicker, setShowEmojiPicker,
    showTagDropdown, setShowTagDropdown,
    fileInputRef,
    editorRef,
    recommendation, setRecommendation,
    isRecommendationAttached, setIsRecommendationAttached,
    rejectionError,
    showSuccess,
    step, setStep,
    isPending, isCreating, isUpdating, isAnalyzing,
    canSubmit,
    handleImageSelect,
    removeImage,
    resetForm,
    handleAction,
  };
}
