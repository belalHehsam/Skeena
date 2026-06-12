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
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "bg-background text-muted-foreground hover:bg-primary border hover:text-white dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
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
