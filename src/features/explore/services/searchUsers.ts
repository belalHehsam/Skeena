import { customFetch } from "@/services/customFetch";
import { createQueryString } from "@/lib/createQueryString";
import type { SearchUsersResponse } from "../types/explore";


export function searchUsers(
  query: string,
  page: number,
  limit = 10
): Promise<SearchUsersResponse> {
  const qs = createQueryString({ search: query, page, limit });
  return customFetch<SearchUsersResponse>(`/users?${qs}`);
}
