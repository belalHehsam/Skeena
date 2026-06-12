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
            className={`cursor-pointer rounded-lg px-4 py-2 font-medium transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
