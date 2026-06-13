import type { Category } from "@/types/category";

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
  return (
    <div className="flex w-full items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
      <button
        onClick={() => onSelectCategory("all")}
        className={`shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold font-heading transition-all duration-200 border border-transparent ${
          selectedCategoryId === "all"
            ? "bg-primary text-white shadow-sm"
            : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300"
        }`}
      >
        All Rooms
      </button>

      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => onSelectCategory(category._id)}
          className={`shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold font-heading transition-all duration-200 border border-transparent ${
            selectedCategoryId === category._id
              ? "bg-primary text-white shadow-sm"
              : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
