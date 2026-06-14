import { customFetch } from "@/services/customFetch";
import type { AnalyzePostResponse } from "../types/post";

export function analyzePost(formData: FormData) {
	return customFetch<AnalyzePostResponse>("/posts/analyze", {
		method: "POST",
		body: formData,
	});
}
