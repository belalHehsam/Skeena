import { customFetch } from "@/services/customFetch";

export async function createComment(postId: string, content: string) {
  return await customFetch(`/comments`, {
    method: "POST",
    body: JSON.stringify({ postId, content }),
  });
}