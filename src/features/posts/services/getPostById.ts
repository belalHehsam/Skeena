import { customFetch } from "@/services/customFetch";
import type { GetPostByIdResponse } from "../types/post";

export function getPostById(id: string) {
	return customFetch<GetPostByIdResponse>(`/posts/${id}`, {
		method: "GET",
	});
}
