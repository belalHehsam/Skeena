import { BookOpen, ScrollText, Heart, Users, Plus, Check } from "lucide-react";
import type { PostTag } from "../hooks/useCreatePostForm";

export const CATEGORIES = [
	{ value: "quran", label: "Quran", icon: BookOpen },
	{ value: "hadith", label: "Hadith", icon: ScrollText },
	{ value: "fiqh", label: "Reflection", icon: Heart },
	{ value: "general", label: "Community", icon: Users },
] as const;

export const EXTRA_TAGS = [
	{ value: "dua", label: "Dua" },
	{ value: "tafsir", label: "Tafsir" },
	{ value: "seerah", label: "Seerah" },
	{ value: "reminder", label: "Reminder" },
] as const;

interface PostTagsSelectorProps {
  tags: PostTag[];
  setTags: React.Dispatch<React.SetStateAction<PostTag[]>>;
  showTagDropdown: boolean;
  setShowTagDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  t: any;
}

export function PostTagsSelector({ tags, setTags, showTagDropdown, setShowTagDropdown, t }: PostTagsSelectorProps) {
  return (
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
            {t(`tags.${cat.value}`)}
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
            {t(`tags.${tag}`)}
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
                    {t(`tags.${tag.value}`)}
                    {tags.includes(tag.value as PostTag) && <Check className="h-4 w-4 text-primary-600 dark:text-primary-400" />}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
