import { customFetch } from "@/services/customFetch";
import type { JSendSuccess } from "@/features/auth/types/auth";

export async function searchUsers(searchQuery?: string) {
  const queryParam = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
  const res = await customFetch<JSendSuccess<{ data: any[] } | any[]>>(`/api/users${queryParam}`);
  
  // Robust checking for JSend format or direct array
  if (res.status === "success" && res.data) {
    if (Array.isArray(res.data)) {
      return res.data;
    }
    if (typeof res.data === "object" && "data" in res.data && Array.isArray((res.data as any).data)) {
      return (res.data as any).data;
    }
  }
  return [];
}
