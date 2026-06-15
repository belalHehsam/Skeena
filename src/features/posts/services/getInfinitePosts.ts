import { createQueryString } from "@/lib/createQueryString";
import { customFetch } from "../../../services/customFetch";
import type { PostResponse } from "../types/post";
export function getInfinitePosts(page: number, category?: string, search?: string) {
  const query: Record<string, string | number> = { page, limit: 10 };
  if (category && category.toLowerCase() !== "all") {
    query.tag = category.toLowerCase();
  }
  if (search) {
    query.search = search;
  }
  const queryString = createQueryString(query);
  return customFetch<PostResponse>(`/posts/feed?${queryString}`);
}
