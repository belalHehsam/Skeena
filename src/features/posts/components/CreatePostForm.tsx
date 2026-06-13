import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { RecommendationCard } from "./RecommendationCard";
import { TipTapEditor } from "./TipTapEditor";
import { X, Check, Send, Asterisk, ImageIcon, Smile, Tag } from "lucide-react";
import { useCreatePostForm } from "../hooks/useCreatePostForm";
import { PostTagsSelector } from "./PostTagsSelector";
import { PostImagePreview } from "./PostImagePreview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function CreatePostForm() {
  const { t } = useTranslation("createPost");
  const { user } = useAuth();
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
    <div className="mx-auto w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 relative max-h-[90dvh] sm:max-h-[85vh] overflow-hidden">
      <div className="overflow-y-auto flex flex-col flex-1 min-h-0">
        {/* Spacer for close button */}
        <div className="h-12 sm:h-14 w-full shrink-0" />
        
        {rejectionError && (
          <div className="flex items-start gap-3 border-b border-red-200 bg-red-50 p-4 rounded-t-2xl dark:border-red-800 dark:bg-red-950/30 shrink-0">
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

      {showSuccess && (
        <div className="flex items-center justify-between border-b border-primary-200 bg-primary-50 p-4 rounded-t-2xl dark:border-primary-800 dark:bg-primary-950/30">
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <p className="font-medium text-primary-700 dark:text-primary-300">
              {t('createPost:status.success')}
            </p>
          </div>
          <Button onClick={resetForm} variant="outline" size="sm" className="h-8">
            {t('createPost:buttons.createAnother')}
          </Button>
        </div>
      )}

      <form onSubmit={handleAction} className="flex flex-col flex-1 p-4 sm:p-6 pb-20 sm:pb-6">
        
        {/* Main Editor Area */}
        <div className="flex gap-4">
          <Avatar className="w-10 h-10 border border-neutral-200 dark:border-neutral-800 shrink-0">
            <AvatarImage src={user?.avatar || ""} alt={user?.displayName || user?.username || "User"} />
            <AvatarFallback className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
              {user?.displayName?.[0] || user?.username?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0 flex flex-col pt-1">
            <div className="relative w-full">
              <TipTapEditor
                ref={editorRef}
                content={content}
                placeholder={t('createPost:placeholder') || "What's on your mind?"}
                onChange={(html, length) => {
                  setContent(html);
                  setContentLength(length);
                }}
              />
              
              {showEmojiPicker && (
                <div className="absolute left-0 top-full z-[100] mt-2 shadow-2xl rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
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
              <div className="mt-3">
                <PostImagePreview imagePreview={imagePreview} removeImage={removeImage} />
              </div>
            )}

            {/* AI Recommendation Box */}
            {step === "review" && recommendation && !isRecommendationAttached && (
              <div className="mt-4 border-l-2 border-primary-500 bg-primary-50/50 p-4 rounded-r-xl dark:border-primary-500 dark:bg-primary-950/30">
                <div className="flex items-start gap-3">
                  <Asterisk className="mt-0.5 h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
                  <div className="flex-1 space-y-2">
                    <h4 className="font-serif text-base font-medium text-primary-900 dark:text-primary-100">
                      {t('createPost:recommendation.suggestion')}
                    </h4>
                    <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {t('createPost:recommendation.description', { source: t(`createPost:recommendation.${recommendation.type}`) })}
                    </p>
                    <div className="mt-3 rounded-lg border border-neutral-200/50 bg-white/70 p-4 dark:border-neutral-800/50 dark:bg-black/30">
                      <p className="mb-2 text-right font-serif text-lg leading-relaxed text-neutral-800 dark:text-neutral-200" dir="rtl" lang="ar">
                        {recommendation.arabicText}
                      </p>
                      <p className="text-sm leading-relaxed text-neutral-600 italic dark:text-neutral-400">
                        "{recommendation.translationText}"
                      </p>
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                      <button type="button" onClick={() => setIsRecommendationAttached(true)} className="text-sm font-medium text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:decoration-primary-700 dark:text-primary-400 dark:decoration-primary-700 dark:hover:decoration-primary-400">
                        {t('createPost:buttons.attachReference')}
                      </button>
                      <button type="button" onClick={() => setRecommendation(null)} className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-300">
                        {t('createPost:buttons.dismiss')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === "review" && recommendation && isRecommendationAttached && (
              <div className="mt-4 relative group">
                <button 
                  type="button" 
                  onClick={() => setIsRecommendationAttached(false)} 
                  className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove attachment"
                >
                  <X className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                </button>
                <RecommendationCard recommendation={recommendation} />
              </div>
            )}

            {/* Render tags row immediately below text/images */}
            {tags.length > 0 && (
              <div className="mt-4 w-full">
                <PostTagsSelector 
                  tags={tags} 
                  setTags={setTags} 
                  showTagDropdown={showTagDropdown} 
                  setShowTagDropdown={setShowTagDropdown} 
                  t={t} 
                />
              </div>
            )}

            {/* Mobile Post Settings */}
            <div className="mt-6 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-4 sm:hidden">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {t('createPost:settings.comments')}
              </span>
              <button 
                type="button" 
                onClick={() => setCommentsEnabled(!commentsEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${commentsEnabled ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-700'}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${commentsEnabled ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>
      </form>
      </div>

      {/* Sticky Bottom Toolbar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-t border-neutral-100 dark:border-neutral-800 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between z-20">
        
        {/* Action Icons */}
        <div className="flex items-center gap-0.5 sm:gap-1 text-primary-500">
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              className="p-2 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-full transition-colors flex items-center justify-center"
              title="Add Image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button 
              type="button" 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
              className="p-2 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-full transition-colors flex items-center justify-center"
              title="Add Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
            <div className="relative">
              <button 
                type="button" 
                onClick={() => setShowTagDropdown(!showTagDropdown)} 
                className="p-2 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-full transition-colors flex items-center justify-center"
                title="Add Tag"
              >
                <Tag className="w-5 h-5" />
              </button>
              
              {/* Note: the Tag dropdown renders inside PostTagsSelector too, but if tags.length is 0, PostTagsSelector is hidden! Let's just mount PostTagsSelector below invisibly if needed, or always mount it but hide its pills when empty. */}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 justify-end">
          {step === "review" && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep("draft")}
              className="rounded-full shadow-none text-neutral-500 hover:bg-neutral-100 dark:bg-neutral-800/50 dark:hover:bg-neutral-800 h-8 px-3 sm:h-10 sm:px-6 text-xs sm:text-sm"
            >
              {t('createPost:buttons.editPost')}
            </Button>
          )}

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {t('createPost:settings.comments')}
            </span>
            <button 
              type="button" 
              onClick={() => setCommentsEnabled(!commentsEnabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${commentsEnabled ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-700'}`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${commentsEnabled ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          <Button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-primary-600 px-4 sm:px-6 h-8 sm:h-10 text-xs sm:text-sm font-bold text-white transition-all hover:bg-primary-700 dark:bg-primary-500 shadow-sm disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Asterisk className="mr-1.5 sm:mr-2 h-4 w-4 animate-spin" />
                {t('createPost:buttons.reviewing')}
              </>
            ) : isCreating ? (
              t('createPost:buttons.publishing')
            ) : step === "draft" ? (
              t('createPost:buttons.review')
            ) : (
              <>
                <Send className="mr-1.5 sm:mr-2 h-4 w-4" />
                {t('createPost:buttons.publishNow')}
              </>
            )}
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImageSelect}
        className="hidden"
      />
      
      {/* Invisible mount for Tag Dropdown when tags are empty but dropdown is open */}
      {tags.length === 0 && showTagDropdown && (
         <div className="absolute z-[100] left-4 bottom-20">
           <PostTagsSelector 
              tags={tags} 
              setTags={setTags} 
              showTagDropdown={showTagDropdown} 
              setShowTagDropdown={setShowTagDropdown} 
              t={t} 
            />
         </div>
      )}
    </div>
  );
}
