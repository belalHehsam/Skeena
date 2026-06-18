import type { Category } from "@/types/category";
import { useTranslation } from "react-i18next";
import { getCategoryName } from "@/utils/category";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) {
  const { t, i18n } = useTranslation("common");

  return (
    <div className="flex w-full items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
      <button
        onClick={() => onSelectCategory("all")}
        className={`shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold font-heading transition-all duration-200 border ${
          selectedCategoryId === "all"
            ? "border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800/60 dark:bg-primary-950/40 dark:text-primary-300"
            : "bg-transparent border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900/50"
        }`}
      >
        {t("voice.allRooms")}
      </button>

      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => onSelectCategory(category._id)}
          className={`shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold font-heading transition-all duration-200 border ${
            selectedCategoryId === category._id
              ? "border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800/60 dark:bg-primary-950/40 dark:text-primary-300"
              : "bg-transparent border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900/50"
          }`}
        >
          {getCategoryName(category, i18n.language)}
        </button>
      ))}
    </div>
  );
}
