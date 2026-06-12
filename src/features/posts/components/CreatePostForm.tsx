import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { RecommendationCard } from "./RecommendationCard";
import { TipTapEditor } from "./TipTapEditor";
import { X, Check, Send, Asterisk } from "lucide-react";
import { useCreatePostForm } from "../hooks/useCreatePostForm";
import { PostTagsSelector } from "./PostTagsSelector";
import { PostImagePreview } from "./PostImagePreview";

export function CreatePostForm() {
  const { t } = useTranslation("createPost");
  const {
    content, setContent,
    setContentLength,
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
    isCreating, isAnalyzing,
    canSubmit,
    handleImageSelect,
    removeImage,
    resetForm,
    handleAction,
  } = useCreatePostForm();

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-3 sm:px-4 md:px-0">
      {rejectionError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
          <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
          <div>
            <h3 className="font-semibold text-red-700 dark:text-red-300">
              {t('status.rejected')}
            </h3>
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {rejectionError.content}
            </p>
          </div>
        </div>
      )}

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

      <div className="relative z-10 w-full overflow-visible rounded-2xl border border-neutral-200/60 bg-white/90 backdrop-blur-md shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900/90 transition-all duration-300">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
        
        <form onSubmit={handleAction} className="relative z-10 flex min-h-[300px] flex-col p-4 sm:p-6 md:p-8">
          
          <div className="mb-6 flex flex-col gap-1 rounded-lg bg-primary-50/50 p-4 border border-primary-100/50 dark:bg-primary-950/20 dark:border-primary-900/30">
            <h3 className="text-sm font-semibold text-primary-800 dark:text-primary-200 uppercase tracking-widest">
              {t('reflectionPrompt.title')}
            </h3>
            <p className="font-serif text-lg text-primary-900 dark:text-primary-100 italic">
              "{t('reflectionPrompt.question')}"
            </p>
          </div>

          <PostTagsSelector 
            tags={tags} 
            setTags={setTags} 
            showTagDropdown={showTagDropdown} 
            setShowTagDropdown={setShowTagDropdown} 
            t={t} 
          />

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

          <PostImagePreview imagePreview={imagePreview} removeImage={removeImage} />

          {step === "review" && recommendation && !isRecommendationAttached && (
            <div className="mt-8 border-l-2 border-primary-500 bg-primary-50/30 p-4 sm:p-6 dark:border-primary-500 dark:bg-primary-950/20">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Asterisk className="mt-1 h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
                <div className="flex-1 space-y-3">
                  <h4 className="font-serif text-lg font-medium text-primary-900 dark:text-primary-100">
                    {t('recommendation.suggestion')}
                  </h4>
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {t('recommendation.description', { source: t(`recommendation.${recommendation.type}`) })}
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
