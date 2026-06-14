import { customFetch } from "@/services/customFetch";
import { createQueryString } from "@/lib/createQueryString";
import type { SearchPostsResponse } from "../types/explore";


export function searchPosts(
  query: string,
  page: number,
  limit = 10
): Promise<SearchPostsResponse> {
  const qs = createQueryString({ search: query, page, limit });
  return customFetch<SearchPostsResponse>(`/v1/posts?${qs}`);
}
