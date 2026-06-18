import { useTranslation } from "react-i18next";
import { CATEGORIES } from "../constants/post-category-list";
import type { CategoryFiltersProps } from "../types/category.d";

export default function CategoryFilters({
  activeCategory,
  onCategoryChange,
}: CategoryFiltersProps) {
  const { t } = useTranslation("common");

  return (
    <div className="mx-4 flex touch-pan-x snap-x scrollbar-none items-center gap-2 overflow-x-auto py-2">
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`flex-shrink-0 cursor-pointer rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800/60 dark:bg-primary-950/40 dark:text-primary-300"
                : "bg-transparent border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900/50"
            }`}
          >
            {t(`categories.${category}`, {
              defaultValue: category,
            })}
          </button>
        );
      })}
    </div>
  );
}
