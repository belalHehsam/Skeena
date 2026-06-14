import { Search, X, Compass } from "lucide-react";

const TRENDING_TAGS = [
  "quran",
  "hadith",
  "fiqh",
  "dua",
  "tafsir",
  "seerah",
  "reminder",
  "general",
];

interface ExploreHeroProps {
  inputValue: string;
  isFocused: boolean;
  placeholder: string;
  showTrending: boolean;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onClear: () => void;
  onTagClick: (tag: string) => void;
}

export function ExploreHero({
  inputValue,
  isFocused,
  placeholder,
  showTrending,
  onChange,
  onFocus,
  onBlur,
  onClear,
  onTagClick,
}: ExploreHeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-neutral-100 px-4 pb-8 pt-4 dark:border-neutral-800/60">

      <div className="relative mx-auto max-w-5xl">
        {/* Page title */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 dark:bg-primary/15 dark:ring-primary/25">
            <Compass className="h-4.5 w-4.5" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Explore
            </h1>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Discover posts and people on Majlis
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search
            className={`absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
              isFocused ? "text-primary" : "text-neutral-400"
            }`}
          />
          <input
            id="explore-search-input"
            type="text"
            value={inputValue}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            autoComplete="off"
            className={`h-12 w-full rounded-xl border bg-white pl-11 pr-11 text-sm text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-400 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 ${
              isFocused
                ? "border-primary/40 ring-2 ring-primary/10"
                : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
            }`}
          />
          {inputValue && (
            <button
              onClick={onClear}
              className="absolute top-1/2 right-3.5 -translate-y-1/2 rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Trending tags */}
        {showTrending && (
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-400 dark:text-neutral-500">Trending:</span>
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 text-xs font-medium text-neutral-500 transition-all hover:border-primary/30 hover:bg-primary-50 hover:text-primary dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-primary/30 dark:hover:bg-primary/10 dark:hover:text-primary-400"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
