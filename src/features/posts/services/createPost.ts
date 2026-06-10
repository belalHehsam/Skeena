import { customFetch } from "@/services/customFetch";
import type { CreatePostResponse } from "../types/post";

export function createPost(formData: FormData) {
	return customFetch<CreatePostResponse>("/api/v1/posts", {
		method: "POST",
		body: formData,
	});
}
