import { customFetch } from "../../../services/customFetch";
import type { PostResponse } from "../types/post";
export function togglePostLike(postID: string) {
    return customFetch<PostResponse>(`/v1/posts/${postID}/like`, { method: "POST" })
}