import { createQueryString } from "@/lib/createQueryString";
import { customFetch } from "../../../services/customFetch";
import type { PostResponse } from "../types/post";
export function getInfinitePosts(page: number, category?: string) {
  const query: Record<string, string | number> = { page, limit: 10 };
  if (category && category.toLowerCase() !== "all") {
    query.tag = category.toLowerCase();
  }
  const queryString = createQueryString(query);
  return customFetch<PostResponse>(`/v1/posts/feed?${queryString}`);
}
