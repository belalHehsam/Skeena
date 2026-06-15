import { customFetch } from "@/services/customFetch";
import type { CreatePostResponse } from "../types/post";

export function updatePost({ postId, formData }: { postId: string; formData: FormData }) {
	return customFetch<CreatePostResponse>(`/posts/${postId}`, {
		method: "PATCH",
		body: formData,
	});
}
