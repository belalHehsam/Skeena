import type { Category } from "@/types/category";

/**
 * Returns the localized name of a category if language is Arabic ('ar') and translation exists.
 * Otherwise returns the standard English category name.
 */
export function getCategoryName(category?: Category | null, language?: string): string {
  if (!category) return "";
  if (language?.startsWith("ar") && category.translations?.ar?.name) {
    return category.translations.ar.name;
  }
  return category.name;
}
