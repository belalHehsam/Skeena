import { FileSearch } from "lucide-react";
import { useTranslation } from "react-i18next";

const HINT_TAGS = ["quran", "hadith", "dua"];

interface PostsEmptyPromptProps {
  query: string;
}

export function PostsEmptyPrompt({ query }: PostsEmptyPromptProps) {
  const { t } = useTranslation(["explore", "common"]);
  const isShort = !query || query.trim().length < 2;

  return (
    <div className="flex flex-col items-center gap-5 py-24 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/40 dark:to-primary-900/20">
        <FileSearch className="h-9 w-9 text-primary" />
        {!isShort && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-500 dark:bg-red-950/50 dark:text-red-400">
            0
          </span>
        )}
      </div>

      <div>
        <p className="font-heading text-base font-semibold text-neutral-700 dark:text-neutral-300">
          {isShort ? t("empty.whatAreYouLookingFor") : t("empty.noResultsFor", { query })}
        </p>
        <p className="mt-1.5 text-sm text-neutral-400 dark:text-neutral-500">
          {isShort
             ? t("empty.typeMinCharsPosts")
             : t("empty.tryDifferentKeywords")}
        </p>
      </div>

      {isShort && (
        <div className="flex flex-wrap justify-center gap-2">
          {HINT_TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
            >
              #{t("common:categories." + tag, { defaultValue: tag })}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
