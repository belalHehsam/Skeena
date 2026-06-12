import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { useCreatePost } from "./useCreatePost";
import { useAnalyzePost } from "./useAnalyzePost";
import type { AnalyzePostResponse, Recommendation } from "../types/post";
import type { TipTapEditorRef } from "../components/TipTapEditor";

export type PostTag = "quran" | "hadith" | "fiqh" | "general" | "dua" | "tafsir" | "seerah" | "reminder";

export function useCreatePostForm() {
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
    setRecommendation(null);
    setIsRecommendationAttached(false);
    setRejectionError(null);
    setShowSuccess(false);
    setStep("draft");
  }

  function submitForAnalysis(formData: FormData) {
    if (imageFile) formData.append("image", imageFile);
    analyzePost(formData, {
      onSuccess: (data: AnalyzePostResponse) => {
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
  }

  function submitFinalPost(formData: FormData) {
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

  function handleAction(e?: FormEvent) {
    if (e) e.preventDefault();
    if (!content.trim() || isPending || tags.length === 0) return;

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

  const canSubmit = contentLength > 0 && !isPending && tags.length > 0;

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
    isPending, isCreating, isAnalyzing,
    canSubmit,
    handleImageSelect,
    removeImage,
    resetForm,
    handleAction,
  };
}
