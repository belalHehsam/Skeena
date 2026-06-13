import { customFetch } from "@/services/customFetch";
import type { JSendSuccess } from "@/features/auth/types/auth";
import type { Category } from "@/types/category";

export async function getCategories() {
  const res = await customFetch<JSendSuccess<{ data: Category[] }>>(
    "/categories"
  );
  return res.data.data;
}
