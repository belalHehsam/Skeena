import { customFetch } from "@/services/customFetch";

export async function createComment(postId: string, content: string) {
  return await customFetch(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}