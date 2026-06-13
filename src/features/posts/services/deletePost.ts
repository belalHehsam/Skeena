import { customFetch } from "@/services/customFetch";
import type { Post } from "../types/post";

export default function deletePost(postId: string) {
  console.log("from services", postId);
  console.log(customFetch<Post>(`/v1/posts/${postId}`));

  return customFetch<Post>(`/v1/posts/${postId}`, { method: "delete" });
}
