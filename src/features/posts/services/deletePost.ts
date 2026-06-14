import { customFetch } from "@/services/customFetch";
import type { Post } from "../types/post";

export default function deletePost(postId: string) {
  console.log("from services", postId);
  console.log(customFetch<Post>(`/posts/${postId}`));

  return customFetch<Post>(`/posts/${postId}`, { method: "delete" });
}
